# Testing Guide - Infusio Payments

## Mercado Pago Test User (Buyer)
- **User**: `TESTUSER127999054191347397`
- **Pass**: `QNiXEuQx20`
- **PIN**: `403203`

## How to Test the Webhook
1. Start your local server: `npm run dev`
2. Start localtunnel: `npx localtunnel --port 3000`
3. Ensure the localtunnel URL is configured in Mercado Pago Developers Dashboard.
4. Generate a payment (using the `charge` API or the UI).
5. Open the `checkout_url`.
6. Log in with the test user above.
7. Complete the payment with a test card.
8. Check the terminal logs for webhook confirmation.

## Clerk Test Users
- **Admin**: (Asigned via Clerk Dashboard metadata `{"role": "admin"}`)
- **Buyer**: `user_3DMq5QQsqVac4Fe1bmj0mhRLdel`
