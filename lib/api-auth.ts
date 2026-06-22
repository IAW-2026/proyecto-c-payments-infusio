import { NextRequest, NextResponse } from "next/server";

/**
 * Validates the x-api-key header against the PAYMENTS_API_KEY env var.
 * Returns a 401 NextResponse if invalid, or null if the key is valid.
 *
 * Usage in route handlers:
 * ```ts
 * const authError = validateApiKey(request);
 * if (authError) return authError;
 * ```
 */
export function validateApiKey(request: NextRequest): NextResponse | null {
  const apiKey = request.headers.get("x-api-key");
  const expectedKey = process.env.PAYMENTS_API_KEY;

  if (!expectedKey) {
    console.error("PAYMENTS_API_KEY is not configured in environment variables");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  if (!apiKey || apiKey !== expectedKey) {
    return NextResponse.json(
      { error: "Unauthorized: invalid or missing API key" },
      { status: 401 }
    );
  }

  return null;
}

/**
 * Validates the x-api-key header against the CONTROL_API_KEY env var.
 * Used for endpoints consumed exclusively by the Control Panel app.
 */
export function validateControlApiKey(request: NextRequest): NextResponse | null {
  const apiKey = request.headers.get("x-api-key");
  const expectedKey = process.env.CONTROL_API_KEY;

  if (!expectedKey) {
    console.error("CONTROL_API_KEY is not configured in environment variables");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  if (!apiKey || apiKey !== expectedKey) {
    return NextResponse.json(
      { error: "Unauthorized: invalid or missing API key" },
      { status: 401 }
    );
  }

  return null;
}

/**
 * Validates the x-api-key header against EITHER PAYMENTS_API_KEY or CONTROL_API_KEY.
 * Used for shared endpoints consumed by both the Seller App and the Control Panel.
 */
export function validateAnyServiceApiKey(request: NextRequest): NextResponse | null {
  const apiKey = request.headers.get("x-api-key");
  const paymentsKey = process.env.PAYMENTS_API_KEY;
  const controlKey = process.env.CONTROL_API_KEY;

  if (!paymentsKey && !controlKey) {
    console.error("No API keys configured (PAYMENTS_API_KEY / CONTROL_API_KEY)");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: "Unauthorized: missing API key" },
      { status: 401 }
    );
  }

  const isValid = (paymentsKey && apiKey === paymentsKey) || (controlKey && apiKey === controlKey);

  if (!isValid) {
    return NextResponse.json(
      { error: "Unauthorized: invalid API key" },
      { status: 401 }
    );
  }

  return null;
}
