import { SignIn } from "@clerk/nextjs";

// Next.js requires default export for pages
// eslint-disable-next-line import/no-default-export
export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <h1 className="font-brand text-3xl text-brown mb-2">
          Infusio <span className="text-olive">Payments</span>
        </h1>
        <p className="text-sm text-brown/60 mb-8">
          Sign in to continue
        </p>
        <SignIn />
      </div>
    </div>
  );
}


