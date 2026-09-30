import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  PublicPage, AUTH_CARD, AUTH_COLUMN, AUTH_ICON_TILE, AUTH_TITLE, TEXT_LINK, FIELD_ERROR,
} from '@/components/public/PublicPage';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { toast } = useToast();
  
  const [isChecking, setIsChecking] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetStatus, setResetStatus] = useState('idle'); // idle, success, error
  const [errorMessage, setErrorMessage] = useState('');
  // True when the visitor arrived from a Supabase recovery email: there is
  // no ?token=, and the Supabase client has already turned the link into a
  // session. The new password then goes through supabase.auth.updateUser.
  const [isRecovery, setIsRecovery] = useState(false);
  // True when Supabase sent the visitor back with an error (a used or
  // expired recovery link), so the page can offer a fresh link.
  const [linkExpired, setLinkExpired] = useState(false);

  // Extract token from query parameters
  const token = searchParams.get('token');

  // Log incoming token immediately for debugging (Task 3)
  useEffect(() => {
    console.log('--- PASSWORD RESET DEBUG START ---');
    console.log('URL Search Params:', searchParams.toString());
    console.log('Extracted Token:', token);
    if (!token) {
        console.warn('Token is missing from URL parameters.');
    }
  }, [token, searchParams]);

  // Password Strength Logic
  const password = watch('password', '');
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    let score = 0;
    if (password.length > 5) score++;
    if (password.length > 9) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setStrength(score);
  }, [password]);

  const getStrengthColor = () => {
    if (strength <= 2) return 'bg-pl-danger';
    if (strength <= 3) return 'bg-pl-warning';
    return 'bg-pl-success';
  };

  const getStrengthText = () => {
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  };

  // Validate Token on Load
  useEffect(() => {
    const validateToken = async () => {
        if (!token) {
            // Self-serve recovery: /forgot-password sends a Supabase recovery
            // email that lands here with a session in place of a token.
            // getSession waits for the client to finish reading the link.
            try {
                const { data } = await supabase.auth.getSession();
                const recoveryUser = data?.session?.user;
                if (recoveryUser) {
                    setIsRecovery(true);
                    setIsValidToken(true);
                    setUserEmail(recoveryUser.email || '');
                    setIsChecking(false);
                    return;
                }
            } catch (err) {
                console.error("Recovery session check failed:", err);
            }

            const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
            const queryParams = new URLSearchParams(window.location.search);
            if (hashParams.get('error') || hashParams.get('error_code') || queryParams.get('error_code')) {
                setLinkExpired(true);
                setErrorMessage("This reset link has expired or was already used. Request a new link to continue.");
                setIsChecking(false);
                return;
            }

            setErrorMessage("Invalid reset link. Token is missing.");
            setIsChecking(false);
            return;
        }

        try {
            console.log('Invoking reset-password function with action: check');
            
            const { data, error } = await supabase.functions.invoke('reset-password', {
                body: { action: 'check', token }
            });

            console.log('Supabase Function Result (Check):', { data, error });

            if (error) {
                console.error("Supabase invoke error:", error);
                throw new Error("Failed to connect to the server.");
            }
            
            if (data && data.success) {
                console.log('Token is valid. Email:', data.email);
                setIsValidToken(true);
                setUserEmail(data.email);
            } else {
                console.warn('Token validation failed:', data?.error);
                setIsValidToken(false);
                setErrorMessage(data?.error || "This link is invalid or has expired.");
            }
        } catch (err) {
            console.error("Validation error:", err);
            setIsValidToken(false);
            setErrorMessage("Failed to validate link. Please try again later.");
        } finally {
            setIsChecking(false);
        }
    };

    validateToken();
  }, [token]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setResetStatus('idle');
    setErrorMessage('');

    if (isRecovery) {
        try {
            const { error } = await supabase.auth.updateUser({ password: data.password });
            if (error) throw new Error(error.message);

            setResetStatus('success');
            toast({
                title: "Success",
                description: "Your password has been updated."
            });

            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            console.error("Recovery Password Error:", err);
            setResetStatus('error');
            setErrorMessage(err.message || "Failed to update password. Please request a new link.");
        } finally {
            setIsSubmitting(false);
        }
        return;
    }

    try {
        console.log('Submitting password reset request...');
        const { data: result, error } = await supabase.functions.invoke('reset-password', {
            body: {
                action: 'reset',
                token,
                new_password: data.password
            }
        });

        console.log('Supabase Function Result (Reset):', { result, error });

        if (error) throw new Error(error.message);

        if (result && !result.success) {
             throw new Error(result.error || "Failed to reset password.");
        }

        setResetStatus('success');
        toast({
            title: "Success",
            description: "Your password has been set successfully."
        });

        // Delay redirect
        setTimeout(() => navigate('/login'), 3000);

    } catch (err) {
        console.error("Reset Password Error:", err);
        setResetStatus('error');
        setErrorMessage(err.message || "Failed to reset password. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isChecking) {
      return (
        <PublicPage testId="reset-password-theme-scope" mainClassName={AUTH_COLUMN}>
            <div role="status" aria-label="Checking your reset link">
                <Loader2 className="w-10 h-10 text-pl-primary animate-spin" />
            </div>
        </PublicPage>
      )
  }

  return (
    <>
      <Helmet>
        <title>Set Password | Petrolord NextGen</title>
      </Helmet>

      <PublicPage testId="reset-password-theme-scope" mainClassName={AUTH_COLUMN}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-full max-w-md space-y-8 ${AUTH_CARD}`}
        >
          {/* Header */}
          <div className="text-center">
            <div className={`${AUTH_ICON_TILE} bg-pl-primary text-pl-primary-fg shadow-pl-md`}>
                <Lock className="h-7 w-7" />
            </div>
            <h1 className={AUTH_TITLE}>
              Set Your Password
            </h1>
            {isRecovery ? (
            <p className="mt-2 text-sm text-pl-muted">
              Choose a new password for your account.
            </p>
            ) : (
            <p className="mt-2 text-sm text-pl-muted">
              Create a secure password to activate your university admin account.
            </p>
            )}
          </div>

          {/* Error View (Invalid Token or Submit Error) */}
          {(!isValidToken || resetStatus === 'error') && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Action Failed</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Invalid Token Only - Show Back Button */}
          {!isValidToken && !isSubmitting && (
               <div className="text-center mt-4">
                 {linkExpired && (
                 <Button asChild className="mr-2">
                    <Link to="/forgot-password">Request a new link</Link>
                 </Button>
                 )}
                 <Button asChild variant="outline">
                    <Link to="/login">Return to Login</Link>
                 </Button>
               </div>
          )}

          {/* Success View */}
          {resetStatus === 'success' ? (
            <div className="text-center py-8 space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-pl-success/40 bg-pl-success-bg text-pl-success-text mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-pl-text">Password Set Successfully!</h3>
                <p className="text-pl-muted">
                    {isRecovery
                      ? 'Your new password is saved. You will be redirected to the login page shortly.'
                      : 'Your account is now active. You will be redirected to the login page shortly.'}
                </p>
                <Button asChild className="w-full mt-4">
                    <Link to="/login">Go to Login Now</Link>
                </Button>
            </div>
          ) : isValidToken && (
            /* Form View */
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">

                {/* Readonly Email */}
                <div>
                  <Label className="text-xs uppercase font-bold text-pl-muted tracking-wider">Account Email</Label>
                  <div className="mt-1 flex items-center px-3 py-2 bg-pl-sunken border border-pl-border rounded-lg text-pl-text text-sm font-pl-mono break-all">
                    {userEmail || 'Loading...'}
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-pl-text">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    disabled={isSubmitting}
                    placeholder="Enter new password"
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Minimum 6 characters'
                        }
                    })}
                  />
                  {/* Strength Meter */}
                  <div className="h-1.5 w-full bg-pl-border rounded-full overflow-hidden mt-2">
                    <div
                        className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${(strength / 5) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                     <span className="text-pl-muted">Strength check</span>
                     <span className={`font-medium ${strength > 3 ? 'text-pl-success-text' : 'text-pl-muted'}`}>{getStrengthText()}</span>
                  </div>
                  {errors.password && <p className={`${FIELD_ERROR} text-xs`}>{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-pl-text">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    disabled={isSubmitting}
                    placeholder="Repeat password"
                    {...register('confirmPassword', {
                        validate: val => val === password || 'Passwords do not match'
                    })}
                  />
                  {errors.confirmPassword && <p className={`${FIELD_ERROR} text-xs`}>{errors.confirmPassword.message}</p>}
                </div>

              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  aria-label={isSubmitting ? 'Setting your password' : undefined}
                  className="w-full h-12 font-bold"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Set Password & Login"
                  )}
                </Button>
              </div>

              <div className="text-center">
                <Link to="/login" className={`inline-flex items-center text-sm ${TEXT_LINK}`}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </motion.div>
      </PublicPage>
    </>
  );
};

export default ResetPasswordPage;