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

## Cards
Tarjeta
	Número
	Código de seguridad
	Fecha de caducidad
    
Mastercard
	
5031 7557 3453 0604
	
123
	
11/30
Visa
	
4509 9535 6623 3704
	
123
	
11/30
American Express
	
3711 803032 57522
	
1234
	
11/30
Mastercard Debito
	
5287 3383 1025 3304
	
123
	
11/30
Visa Debito
	
4002 7686 9439 5619
	
123
	
11/30
