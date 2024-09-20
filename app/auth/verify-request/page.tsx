// app/auth/verify-request/page.tsx

export default function VerifyRequest() {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Check your email</h1>
          <p className="mb-4">A sign in link has been sent to your email address.</p>
          <p>If you don't see it, check your spam folder.</p>
        </main>
      </div>
    );
  }
  