import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  KeyRound, 
  Mail, 
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { PublicPage, AUTH_COLUMN, AUTH_ICON_TILE, AUTH_TITLE, TEXT_LINK } from '@/components/public/PublicPage';

const PasswordResetPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // View State: 'detecting' | 'request-link' | 'reset-password'
  const [mode, setMode] = useState('detecting'); 
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(5);

  // Password Strength
  const [strengthScore, setStrengthScore] = useState(0);
  const [requirements, setRequirements] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  });

  // Initialization: Check Session & Params
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const paramEmail = searchParams.get('email');

        if (session) {
          // User is authenticated (clicked magic link)
          setMode('reset-password');
          setEmail(session.user.email || paramEmail || '');
        } else {
          // No session - User needs to request a link
          setMode('request-link');
          if (paramEmail) setEmail(paramEmail);
        }
      } catch (err) {
        console.error("Session check failed", err);
        setMode('request-link');
      }
    };

    checkSession();
  }, [searchParams]);

  // Password Analysis
  useEffect(() => {
    const reqs = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };
    setRequirements(reqs);
    
    const metCount = Object.values(reqs).filter(Boolean).length;
    setStrengthScore((metCount / 5) * 100);
  }, [password]);

  // Countdown for redirect
  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      navigate('/login');
    }
  }, [success, countdown, navigate]);

  const handleRequestLink = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "Reset Link Sent",
        description: "Check your email for the password reset link."
      });
    } catch (err) {
      setError(err.message || "Failed to send reset link.");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (strengthScore < 60) { // Require at least 3/5 requirements
      setError("Password is too weak. Please meet more requirements.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setSuccess(true);
      toast({
        title: "Success!",
        description: "Password updated successfully."
      });
    } catch (err) {
      setError(err.message || "Failed to update password. Your session may have expired.");
      if (err.message.includes("session")) {
        setMode('request-link'); // Fallback if session died
      }
    } finally {
      setLoading(false);
    }
  };

  // Each requirement reads "met" or "not met" to a screen reader, so the
  // colour is never the only signal.
  const StrengthItem = ({ met, label }) => (
    <div className={`flex items-center gap-2 text-xs transition-colors duration-300 ${met ? 'text-pl-success-text' : 'text-pl-muted'}`}>
      {met ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-pl-border-strong" />}
      <span>{label}</span>
      <span className="sr-only">{met ? 'met' : 'not met'}</span>
    </div>
  );

  if (mode === 'detecting') {
    return (
      <PublicPage testId="forgot-password-theme-scope" mainClassName={AUTH_COLUMN}>
        <div role="status" aria-label="Checking your session">
          <Loader2 className="w-8 h-8 text-pl-primary animate-spin" />
        </div>
      </PublicPage>
    );
  }

  const fieldIcon = 'absolute left-3 top-3 h-4 w-4 text-pl-muted';
  const eyeButton = 'absolute right-3 top-3 rounded-sm text-pl-muted transition-colors hover:text-pl-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus';

  return (
    <PublicPage testId="forgot-password-theme-scope" mainClassName={AUTH_COLUMN}>
      <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Header Branding */}
        <div className="text-center mb-8 space-y-2">
          <div className={`${AUTH_ICON_TILE} bg-pl-primary text-pl-primary-fg shadow-pl-md`}>
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className={AUTH_TITLE}>Petrolord NextGen</h1>
          <p className="text-pl-muted font-medium">
            {mode === 'request-link' ? 'Account Recovery' : 'Secure Password Reset'}
          </p>
        </div>

        <Card className="overflow-hidden rounded-2xl bg-pl-raised shadow-pl-lg">
          {/* Progress Bar (Visual indicator of steps) */}
          <div className="w-full bg-pl-border h-1">
            <div
              className="h-full bg-pl-accent transition-all duration-500"
              style={{ width: mode === 'request-link' ? '50%' : '100%' }}
            />
          </div>

          <CardHeader>
            <CardTitle className="text-xl text-pl-text flex items-center gap-2">
              {success ? (
                <span className="text-pl-success-text">Success</span>
              ) : mode === 'request-link' ? (
                <>Step 1: Identify Account</>
              ) : (
                <>Step 2: Create New Password</>
              )}
            </CardTitle>
            <CardDescription>
              {success
                ? (mode === 'request-link' ? "Email sent successfully." : "Password updated successfully.")
                : (mode === 'request-link' ? "Enter your email to receive a secure reset link." : "Please enter a strong password to secure your account.")}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="animate-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success ? (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                <div className="w-20 h-20 bg-pl-success-bg rounded-full flex items-center justify-center border border-pl-success/40">
                  <CheckCircle className="w-10 h-10 text-pl-success-text" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-pl-text">
                    {mode === 'request-link' ? 'Reset Link Sent' : 'Password Reset Complete'}
                  </h3>
                  <p className="text-pl-muted text-sm mt-2 max-w-xs mx-auto">
                    {mode === 'request-link'
                      ? `We've sent a link to ${email}. Please check your inbox and spam folder.`
                      : `You will be redirected to the login page in ${countdown} seconds.`}
                  </p>
                </div>
                {mode === 'reset-password' && (
                  <Button onClick={() => navigate('/login')} className="w-full">
                    Go to Login Now
                  </Button>
                )}
              </div>
            ) : (
              /* Forms Container */
              <div className="space-y-4">
                {/* Email Field - Always Visible but state changes */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-pl-text">Email Address</Label>
                  <div className="relative">
                    <Mail className={fieldIcon} />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      readOnly={mode === 'reset-password'}
                      disabled={loading || mode === 'reset-password'}
                      placeholder="you@example.com"
                      className={`pl-10 ${mode === 'reset-password' ? 'pr-10 opacity-70 cursor-not-allowed' : ''}`}
                    />
                    {mode === 'reset-password' && (
                      <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-pl-success-text" />
                    )}
                  </div>
                </div>

                {/* Password Fields - Only visible in reset mode */}
                {mode === 'reset-password' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-pl-text">New Password</Label>
                      <div className="relative">
                        <Lock className={fieldIcon} />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className={eyeButton}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {/* Password Strength Meter */}
                      <div className="space-y-2 pt-1">
                        <div className="flex justify-between text-xs text-pl-muted mb-1">
                          <span>Strength</span>
                          <span>{Math.round(strengthScore)}%</span>
                        </div>
                        <Progress value={strengthScore} aria-label="Password strength" className={`h-1.5 ${
                          strengthScore < 40 ? "[&>div]:bg-pl-danger" :
                          strengthScore < 80 ? "[&>div]:bg-pl-warning" :
                          "[&>div]:bg-pl-success"
                        }`} />
                        <div className="grid grid-cols-2 gap-y-1 gap-x-4 pt-1">
                          <StrengthItem met={requirements.length} label="8+ Characters" />
                          <StrengthItem met={requirements.upper} label="Uppercase" />
                          <StrengthItem met={requirements.lower} label="Lowercase" />
                          <StrengthItem met={requirements.number} label="Number" />
                          <StrengthItem met={requirements.special} label="Special Char" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm" className="text-pl-text">Confirm Password</Label>
                      <div className="relative">
                        <Lock className={fieldIcon} />
                        <Input
                          id="confirm"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          aria-invalid={Boolean(confirmPassword && password !== confirmPassword)}
                          className={`pl-10 pr-10 ${confirmPassword && password !== confirmPassword ? 'border-pl-danger' : ''}`}
                          placeholder="Re-enter password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          className={eyeButton}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {confirmPassword && password !== confirmPassword && (
                        <p className="text-xs text-pl-danger-text animate-in slide-in-from-top-1">Passwords do not match</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4">
                  {mode === 'request-link' ? (
                    <Button
                      onClick={handleRequestLink}
                      disabled={loading || !email}
                      className="w-full h-11"
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                      Send Reset Link
                    </Button>
                  ) : (
                    <Button
                      onClick={handleUpdatePassword}
                      disabled={loading || !password || !confirmPassword || password !== confirmPassword || strengthScore < 60}
                      className="w-full h-11"
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                      Update Password
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="bg-pl-sunken border-t border-pl-border py-4 flex flex-col gap-2">
            {mode === 'reset-password' && !success && (
               <button
               type="button"
               onClick={() => {
                 setMode('request-link');
                 setPassword('');
                 setConfirmPassword('');
                 setError('');
               }}
               className="text-xs text-pl-muted hover:text-pl-text flex items-center gap-1 transition-colors"
             >
               <ArrowLeft className="w-3 h-3" />
               Not {email}? Request a new link
             </button>
            )}

            <button
              type="button"
              onClick={() => navigate('/login')}
              className={`text-sm ${TEXT_LINK}`}
            >
              Back to Login
            </button>
          </CardFooter>
        </Card>
      </div>
    </PublicPage>
  );
};

export default PasswordResetPage;