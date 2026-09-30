import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, CheckCircle2, Loader2, Lock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { claimPracticeCertificate, verificationUrl } from '@/services/academyService';
import { canClaimPracticeCertificate } from '@/lib/courseType';
import { CERT_TIER_LABELS } from '@/lib/appNames';

const CERT_OF_TIER = { beginner: 'associate', intermediate: 'professional', advanced: 'expert' };

// The certificate step of a PRACTICE course, in the place an app or engine
// course shows its capstone. The tier's final exam is the assessment: once it
// is passed, the learner asks for the certificate and the server issues it
// (academy_claim_practice_certificate checks the course type, the enrolment
// and the passed exam again). `claim` is injectable for tests. On theme
// roles (batch 1B).
const PracticeCertificateCard = ({ app, tier, progress, courseType = 'practice', claim = claimPracticeCertificate }) => {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const label = CERT_TIER_LABELS[CERT_OF_TIER[tier]] || 'Associate';
  const ready = canClaimPracticeCertificate(courseType, progress);
  const expert = tier === 'advanced';

  const onClaim = async () => {
    setBusy(true);
    setError(null);
    try {
      setResult(await claim(app, tier));
    } catch (e) {
      setError(e?.message || 'The certificate could not be issued.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className={!ready ? 'opacity-70' : ''} data-practice-certificate={tier}>
      <CardHeader className="pb-2">
        <CardTitle className="text-pl-text text-lg flex items-center gap-2">
          {result?.passed ? <CheckCircle2 className="h-5 w-5 text-pl-success-text" />
            : ready ? <Award className="h-5 w-5 text-pl-accent-text" /> : <Lock className="h-5 w-5 text-pl-muted" />}
          {label} certificate
        </CardTitle>
        <CardDescription>
          {expert
            ? 'A practice course has no numeric capstone. The Expert final exam is a written case: pass it and this certificate is issued.'
            : `A practice course has no numeric capstone. Pass the ${label} final exam and this certificate is issued.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {result?.passed && result.certificate_number && (
          <p className="text-pl-text mb-0" data-issued>
            {label} certificate <span className="font-pl-mono text-pl-text font-medium">{result.certificate_number}</span> issued.{' '}
            <Link to="/dashboard/certificates" className="text-pl-primary-text hover:text-pl-primary-text-hover hover:underline inline-flex items-center gap-1">
              My certificates <ArrowRight className="h-3 w-3" />
            </Link>{' '}
            <a href={verificationUrl(result.verify_code)} target="_blank" rel="noreferrer" className="text-pl-muted hover:text-pl-text hover:underline">
              Public verification
            </a>
          </p>
        )}
        {result?.passed && result.already_certified && (
          <p className="text-pl-text mb-0" data-already>You already hold a live {label} certificate for this course.</p>
        )}
        {!result && ready && (
          <Button size="sm" onClick={onClaim} disabled={busy}>
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Award className="mr-2 h-4 w-4" />}
            Issue my {label} certificate
          </Button>
        )}
        {!result && !ready && (
          <p className="text-xs text-pl-muted mb-0" data-locked>Locked until the final exam is passed.</p>
        )}
        {error && <p className="text-pl-danger-text mb-0" data-error>{error}</p>}
      </CardContent>
    </Card>
  );
};

export default PracticeCertificateCard;
