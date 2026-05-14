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
