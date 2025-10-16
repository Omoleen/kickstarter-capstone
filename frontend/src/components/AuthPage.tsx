import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/simple-card';
import { Button } from './ui/simple-button';
import { Input } from './ui/simple-input';
import { Label } from './ui/simple-label';
import { Lightbulb, Mail, Lock, User } from 'lucide-react';

interface AuthPageProps {
  mode: 'login' | 'signup';
  onLogin: (email: string, password: string) => Promise<boolean>;
  onSignup: (name: string, email: string, password: string) => Promise<boolean>;
  onSwitchMode: (mode: 'login' | 'signup') => void;
  loading?: boolean;
  error?: string;
}

export function AuthPage({ mode, onLogin, onSignup, onSwitchMode, loading = false, error: propError = '' }: AuthPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use prop error if available, otherwise use local error
  const error = propError || localError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const success = await onLogin(formData.email, formData.password);
        if (!success && !propError) {
          setLocalError('Invalid email or password');
        }
      } else {
        const success = await onSignup(formData.name, formData.email, formData.password);
        if (!success && !propError) {
          setLocalError('Failed to create account');
        }
      }
    } catch (err) {
      if (!propError) {
        setLocalError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setLocalError('');
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Lightbulb className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {mode === 'login' ? 'Welcome Back' : 'Join Idea Launchpad'}
          </CardTitle>
          <p className="text-muted-foreground">
            {mode === 'login' 
              ? 'Sign in to your account to share and discover ideas'
              : 'Create an account to start sharing your innovative ideas'
            }
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || loading}
            >
              {(isSubmitting || loading) ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {mode === 'login' 
                ? "Don't have an account? " 
                : "Already have an account? "
              }
              <Button
                variant="link"
                className="p-0 h-auto font-medium"
                onClick={() => onSwitchMode(mode === 'login' ? 'signup' : 'login')}
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </Button>
            </p>
          </div>

          {mode === 'login' && (
            <div className="mt-4 p-3 bg-muted/50 rounded-md">
              <p className="text-xs text-muted-foreground">
                <strong>Demo accounts:</strong><br/>
                sarah@example.com / alex@example.com / jordan@example.com<br/>
                Password: any password will work
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}