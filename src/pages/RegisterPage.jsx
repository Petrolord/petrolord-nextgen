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

  const inputClass =
    'appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#BFFF00] focus:border-[#BFFF00] sm:text-sm bg-gray-700 text-white';

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
          className: 'bg-[#BFFF00] text-slate-900',
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
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A] py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full space-y-8 p-10 bg-[#1E293B] rounded-lg shadow-lg border border-gray-800"
        >
          <div>
            <img
              className="mx-auto h-16 w-auto object-contain"
              src="https://horizons-cdn.hostinger.com/80504870-35f5-4fc9-ba7f-f8bc12cf282f/petrolord-symbol-512-7N6nn.png"
              alt="Petrolord NextGen Academy"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Use your <span className="text-[#BFFF00] font-medium">personal email</span> — your
              Academy record, certificates and alumni standing stay with you after graduation.
              University students add their university email later, during campus enrollment.
            </p>
          </div>

          {awaitingConfirmation ? (
            <Alert className="bg-emerald-900/20 border-emerald-800 text-emerald-200">
              <MailCheck className="h-4 w-4" />
              <AlertTitle>Confirm your email</AlertTitle>
              <AlertDescription>
                We sent a confirmation link to your email address. Click it, then{' '}
                <Link to="/login" className="text-[#BFFF00] underline">sign in</Link> to choose
                your enrollment path.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {signupError && (
                <Alert variant="destructive" className="bg-red-900/20 border-red-900">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{signupError}</AlertDescription>
                </Alert>
              )}

              <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="rounded-md shadow-sm space-y-4">
                  <div>
                    <Label htmlFor="display-name" className="block text-sm font-medium text-gray-300 mb-1">
                      Full name
                    </Label>
                    <Input
                      id="display-name"
                      type="text"
                      autoComplete="name"
                      className={inputClass}
                      placeholder="Ada Obi"
                      {...register('displayName', { required: 'Your name is required' })}
                    />
                    {errors.displayName && <p className="mt-1 text-sm text-red-500">{errors.displayName.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email-address" className="block text-sm font-medium text-gray-300 mb-1">
                      Personal email address
                    </Label>
                    <Input
                      id="email-address"
                      type="email"
                      autoComplete="email"
                      className={inputClass}
                      placeholder="you@example.com"
                      {...register('email', { required: 'Email is required' })}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      className={inputClass}
                      placeholder="••••••••"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'At least 8 characters' },
                      })}
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1">
                      Confirm password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      className={inputClass}
                      placeholder="••••••••"
                      {...register('confirmPassword', {
                        validate: (v) => v === watch('password') || 'Passwords do not match',
                      })}
                    />
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#0F172A] bg-[#BFFF00] hover:bg-[#A8E600] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BFFF00] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
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

                <p className="text-center text-sm text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-[#BFFF00] hover:text-[#A8E600]">
                    Sign in
                  </Link>
                </p>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default RegisterPage;
