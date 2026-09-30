import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  PublicPage, AUTH_CARD, AUTH_COLUMN, AUTH_TITLE, TEXT_LINK, FIELD_ERROR, FIELD_LABEL,
} from '@/components/public/PublicPage';

const LoginPage = () => {
  const navigate = useNavigate();
  const { signInWithEmail, user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // If user is already logged in, redirect immediately
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setLoginError(null);

    try {
        const { error } = await signInWithEmail(data.email, data.password);
        
        if (error) {
          console.error("Login error:", error);
          
          let errorMessage = error.message;
          if (errorMessage.includes("Invalid login credentials")) {
             errorMessage = "Incorrect email or password. Please check your credentials.";
          } else if (errorMessage.includes("Email not confirmed")) {
             errorMessage = "Please verify your email address before logging in.";
          }

          setLoginError(errorMessage);
          
          toast({
            title: "Login Failed",
            description: errorMessage,
            variant: "destructive",
          });
          setIsSubmitting(false);
        } else {
          toast({
            title: "Login Successful",
            description: "Redirecting to dashboard...",
          });
          setTimeout(() => navigate('/dashboard'), 500);
        }
    } catch (err) {
        console.error("Unexpected login error:", err);
        setIsSubmitting(false);
        setLoginError("An unexpected network error occurred. Please try again.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Petrolord NextGen Suite</title>
        <meta name="description" content="Login to your Petrolord NextGen Suite account." />
      </Helmet>
      <PublicPage testId="login-theme-scope" mainClassName={AUTH_COLUMN}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`w-full max-w-md space-y-8 ${AUTH_CARD}`}
        >
          <div className="text-center">
            <h1 className={AUTH_TITLE}>
              Sign in to your account
            </h1>
            <p className="mt-2 text-sm text-pl-muted">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {loginError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email-address" className={FIELD_LABEL}>
                  Email address
                </Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="info@petrolord.com"
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <p className={FIELD_ERROR}>{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="password" className={FIELD_LABEL}>
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                />
                {errors.password && <p className={FIELD_ERROR}>{errors.password.message}</p>}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <div className="text-sm">
                <Link to="/forgot-password" className={TEXT_LINK}>
                  Forgot your password?
                </Link>
              </div>
              <div className="text-sm">
                <Link to="/register" className={TEXT_LINK}>
                  Create an account
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </PublicPage>
    </>
  );
};

export default LoginPage;