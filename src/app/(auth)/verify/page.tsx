"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function VerifyPage() {
  const router = useRouter();
  const [emailParam, setEmailParam] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setEmailParam(params.get('email') || '');
    }
  }, []);
  
  const { resendVerificationEmail } = useAuth();
  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      if (!res.ok) throw new Error('Verification failed');
      toast.success('Email verified. Redirecting...');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.message || 'Failed to verify');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Verify your email</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-semibold">Verification Code</label>
                <Input value={code} onChange={(e) => setCode(e.target.value)} />
              </div>
              <div className="flex items-center justify-between">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Verifying...' : 'Verify'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => resendVerificationEmail(email)}>
                  Resend
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
