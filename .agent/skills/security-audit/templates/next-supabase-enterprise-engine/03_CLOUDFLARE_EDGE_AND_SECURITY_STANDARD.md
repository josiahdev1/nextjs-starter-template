# Cloudflare Edge & Perimeter Security Standard
## WAF Defense, Turnstile Bot Mitigation, & Strict HTTP Hardening

---

## 1. Executive Principles

The perimeter security architecture establishes **Cloudflare** as the hardened outer shield protecting the **Vercel** serverless compute runtime and **Supabase** backend. 

By terminating malicious traffic, automated scrapers, credential stuffing bots, and DDoS attempts at Cloudflare's Anycast edge, we ensure that:
1. Origin serverless functions are shielded from resource exhaustion and billing spikes.
2. In-flight requests are protected by cryptographically uncompromised TLS 1.3 transport encryption.
3. Client browsers enforce strict origin isolation via Content-Security-Policy (CSP) with cryptographic nonces.
4. Bot defense (Cloudflare Turnstile) operates silently and with zero layout shift (Zero-CLS).

---

## 2. Cloudflare Edge Perimeter Configuration

### 2.1 SSL/TLS & Transport Security Matrix

| Setting | Required Value | Rationale |
| :--- | :--- | :--- |
| **SSL/TLS Encryption Mode** | **Full (Strict)** | Guarantees end-to-end cryptographic verification between Cloudflare edge and Vercel origin certificate. Prevents MITM attacks. |
| **Minimum TLS Version** | **TLS 1.3** | Deprecates older ciphers with known downgrade vulnerabilities (SWEET32, POODLE, BEAST). Eliminates TLS 1.2 round-trip latency. |
| **HSTS (HTTP Strict Transport Security)** | **Enabled** | Header: `max-age=31536000; includeSubDomains; preload`. Forces browser to remember HTTPS permanently and supports browser preload lists. |
| **Opportunistic Encryption** | **Enabled** | Upgrades legacy cleartext HTTP connections to authenticated TLS where possible. |
| **TLS 1.3 0-RTT (Early Data)** | **Off / Safe Only** | Mitigates replay attacks on state-changing POST/PUT requests across unstable mobile networks. |
| **DNSSEC** | **Active (Algorithm 13)** | Signs DNS records cryptographically with ECDSA P-256 to prevent DNS cache poisoning and BGP hijacking. |

---

### 2.2 Custom Edge WAF Firewall Rules

Configure the following Cloudflare WAF Expression Rules under **Security > WAF > Custom Rules**:

#### Rule 1: Automated Scraper & Exploit Scanner Block
Blocks known vulnerability scanning toolsets, exploit paths, and missing standard headers.
```
(
  http.user_agent contains "sqlmap" or
  http.user_agent contains "nikto" or
  http.user_agent contains "gobuster" or
  http.user_agent contains "masscan" or
  http.user_agent contains "nmap" or
  http.user_agent contains "SemrushBot" or
  http.request.uri.path contains "/.env" or
  http.request.uri.path contains "/.git" or
  http.request.uri.path contains "/wp-login.php" or
  http.request.uri.path contains "/xmlrpc.php"
)
=> Action: Block
```

#### Rule 2: Edge Rate Limiting on Authentication & Sensitive APIs
Protects against brute force and credential stuffing attacks at the network edge before hitting serverless compute.
- **Scope 1 (Auth Mutation)**: `http.request.uri.path in {"/api/auth/login" "/api/auth/register" "/api/auth/reset"}`
  - **Limit**: 5 requests per minute per IP.
  - **Action**: Managed Challenge (Cloudflare Turnstile).
- **Scope 2 (State-Changing API Mutations)**: `http.request.uri.path starts_with "/api/v1/" and http.request.method in {"POST" "PUT" "PATCH" "DELETE"}`
  - **Limit**: 60 requests per minute per IP / Session Header.
  - **Action**: 429 Too Many Requests response with JSON error.

---

## 3. Cloudflare Turnstile Integration

Cloudflare Turnstile provides privacy-preserving bot defense without frustrating CAPTCHA puzzles. Our implementation guarantees zero layout shift (Zero-CLS) by reserving exact container geometry and provides complete error resilience.

### 3.1 Client Component (`components/common/turnstile-widget.tsx`)

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Turnstile, { useTurnstile } from "react-turnstile";

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: "light" | "dark" | "auto";
}

/**
 * Enterprise Turnstile Widget
 * Ensures zero layout shift by pre-reserving a 300x65px geometric bounding box.
 */
export function TurnstileWidget({
  onSuccess,
  onError,
  onExpire,
  theme = "auto",
}: TurnstileWidgetProps) {
  const turnstile = useTurnstile();
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!siteKey) {
    console.warn("NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY is not defined. Bot protection disabled in dev.");
    return null;
  }

  return (
    <div
      ref={widgetRef}
      className="flex items-center justify-center min-h-[65px] min-w-[300px] w-full my-2"
      aria-label="Security verification challenge"
    >
      {isMounted && (
        <Turnstile
          sitekey={siteKey}
          theme={theme}
          onVerify={(token) => {
            onSuccess(token);
          }}
          onError={() => {
            if (onError) onError();
            turnstile.reset();
          }}
          onExpire={() => {
            if (onExpire) onExpire();
            turnstile.reset();
          }}
        />
      )}
    </div>
  );
}
```

---

### 3.2 Backend Verification Service (`lib/security/turnstile.ts`)

Server Actions call this verification routine prior to processing any sensitive transaction.

```typescript
import { headers } from "next/headers";

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

/**
 * Cryptographically verifies a Turnstile challenge token against Cloudflare's verification endpoint.
 */
export async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

  // In local test environments without keys, bypass challenge if explicitly configured
  if (!secretKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn("CLOUDFLARE_TURNSTILE_SECRET_KEY missing in development. Bypassing check.");
      return true;
    }
    throw new Error("CLOUDFLARE_TURNSTILE_SECRET_KEY environment variable is missing on server.");
  }

  if (!token || token.trim().length === 0) {
    return false;
  }

  try {
    const clientIp = headers().get("cf-connecting-ip") || headers().get("x-forwarded-for") || undefined;

    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (clientIp) {
      formData.append("remoteip", clientIp);
    }

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Turnstile verification endpoint returned HTTP status ${response.status}`);
      return false;
    }

    const outcome: TurnstileVerifyResponse = await response.json();

    if (!outcome.success) {
      console.warn("Turnstile validation rejected token:", outcome["error-codes"]);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Network error during Turnstile verification:", error);
    return false;
  }
}
```

---

## 4. HTTP Security Headers & Cryptographic Nonce Configuration

Modern browser security relies on an unyielding Content-Security-Policy (CSP) that prevents Cross-Site Scripting (XSS), Clickjacking, and unauthorized resource embedding.

### 4.1 Nonce-Generating Edge Middleware (`middleware.ts`)

```typescript
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Generate a cryptographically random nonce per request
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // 2. Build strict Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.supabase.co https://images.unsplash.com;
    font-src 'self';
    connect-src 'self' https://*.supabase.co wss://*.supabase.co https://challenges.cloudflare.com;
    frame-src 'self' https://challenges.cloudflare.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, " ").trim();

  // 3. Clone request headers and set nonce for React Server Components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  // 4. Initialize response with updated request headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 5. Append defensive security headers to the browser response
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()"
  );
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. /api/webhooks/* (Webhooks require raw payload passthrough)
     * 2. /_next/static (Static files)
     * 3. /_next/image (Image optimization)
     * 4. /favicon.ico, /robots.txt, /sitemap.xml
     */
    {
      source: "/((?!api/webhooks|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
```

---

## 5. Security Perimeter Verification Checklist

Before deploying to staging or production, execute the following perimeter checks:

1. **Verify SSL Configuration**: Run `curl -vI https://yourdomain.com` and ensure TLS 1.3 negotiation with HTTP/2 or HTTP/3.
2. **Verify Security Headers**:
   ```bash
   curl -s -D - https://yourdomain.com/login -o /dev/null | grep -E "(content-security-policy|x-frame-options|x-content-type-options|permissions-policy)"
   ```
   Ensure `x-frame-options: DENY` and valid `nonce-` inside `content-security-policy`.
3. **Verify Turnstile Enforcement**: Submit authentication requests with an empty or simulated token and verify immediate rejection with HTTP 400 / Action error before database querying.
4. **Verify Origin Protection**: Confirm that direct requests to Vercel origin (`*.vercel.app`) are either redirected or protected by Cloudflare Authenticated Origin Pulls (AOP).
