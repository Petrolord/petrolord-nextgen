import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, AlertCircle, MailCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  PublicPage, AUTH_CARD, AUTH_COLUMN, AUTH_TITLE, TEXT_LINK, FIELD_ERROR, FIELD_LABEL,
} from '@/components/public/PublicPage';

// One identity, four doors (NextGen-Academy-PLAN §1): the account is a
// PERSONAL email — it outlives graduation. Which door you enter through
// (self / campus / residency / sponsored) is chosen later, at
// enrollment; the account itself is the same for everyone. The server
// assigns the base role 'learner' — nothing role-related is sent from
// the client.
const RegisterPage = () => {
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupError, setSignupError] = useState(null);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSignupError(null);
    try {
      const { data: result, error } = await signUp(data.email, data.password, {
        display_name: data.displayName,
      });
      if (error) {
        let message = error.message;
        if (message.includes('already registered')) {
          message = 'An account with this email already exists. Try signing in instead.';
        }
        setSignupError(message);
        toast({ title: 'Registration failed', description: message, variant: 'destructive' });
        setIsSubmitting(false);
        return;
      }
      if (result?.session) {
        toast({
          title: 'Welcome to the Academy',
          description: 'Your account is ready.',
        });
        navigate('/dashboard/enroll');
      } else {
        setAwaitingConfirmation(true);
      }
    } catch (err) {
      console.error('Unexpected signup error:', err);
      setSignupError('An unexpected network error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create account - Petrolord NextGen Academy</title>
        <meta name="description" content="Create your Petrolord NextGen Academy account with your personal email." />
      </Helmet>
      <PublicPage testId="register-theme-scope" mainClassName={AUTH_COLUMN}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`w-full max-w-md space-y-8 ${AUTH_CARD}`}
        >
          <div className="text-center">
            <h1 className={AUTH_TITLE}>
              Create your account
            </h1>
            <p className="mt-2 text-sm text-pl-muted">
              Use your <span className="font-semibold text-pl-text">personal email</span>. Your
              Academy record, certificates and alumni standing stay with you after graduation.
              University students add their university email later, during campus enrollment.
            </p>
          </div>

          {awaitingConfirmation ? (
            <Alert variant="success">
              <MailCheck className="h-4 w-4" />
              <AlertTitle>Confirm your email</AlertTitle>
              <AlertDescription>
                We sent a confirmation link to your email address. Click it, then{' '}
                <Link to="/login" className="font-medium underline">sign in</Link> to choose
                your enrollment path.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {signupError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{signupError}</AlertDescription>
                </Alert>
              )}

              <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="display-name" className={FIELD_LABEL}>
                      Full name
                    </Label>
                    <Input
                      id="display-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Ada Obi"
                      {...register('displayName', { required: 'Your name is required' })}
                    />
                    {errors.displayName && <p className={FIELD_ERROR}>{errors.displayName.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email-address" className={FIELD_LABEL}>
                      Personal email address
                    </Label>
                    <Input
                      id="email-address"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
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
                      type="password"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'At least 8 characters' },
                      })}
                    />
                    {errors.password && <p className={FIELD_ERROR}>{errors.password.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="confirm-password" className={FIELD_LABEL}>
                      Confirm password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      {...register('confirmPassword', {
                        validate: (v) => v === watch('password') || 'Passwords do not match',
                      })}
                    />
                    {errors.confirmPassword && <p className={FIELD_ERROR}>{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create account'
                  )}
                </Button>

                <p className="text-center text-sm text-pl-muted">
                  Already have an account?{' '}
                  <Link to="/login" className={TEXT_LINK}>
                    Sign in
                  </Link>
                </p>
              </form>
            </>
          )}
        </motion.div>
      </PublicPage>
    </>
  );
};

export default RegisterPage;
