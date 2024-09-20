'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from "components/Button/Button";

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      console.log('Attempting to sign in with email:', email);
      const result = await signIn('email', { email, callbackUrl: '/', redirect: false });
      console.log('Sign in result:', result);
      if (result?.error) {
        setError(`Sign in failed: ${result.error}`);
      } else {
        console.log('Sign in successful, redirecting to verify-request page');
        window.location.href = '/auth/verify-request';
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Sign In</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="w-full max-w-xs">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 mb-4 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
          <Button 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e as any as React.FormEvent<HTMLFormElement>);
            }}
            className="w-full mb-4"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in with Email'}
          </Button>
        </form>
        <Button 
          href="#"
          onClick={handleGoogleSignIn} 
          className="w-full max-w-xs"
        >
          Sign in with Google
        </Button>
      </main>
    </div>
  );
}