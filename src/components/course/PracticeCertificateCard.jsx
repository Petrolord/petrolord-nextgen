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
// and the passed exam again). `claim` is injectable for tests.
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
    <Card className={`bg-[#1E293B] border-gray-700 ${!ready ? 'opacity-70' : ''}`} data-practice-certificate={tier}>
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          {result?.passed ? <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            : ready ? <Award className="h-5 w-5 text-[#BFFF00]" /> : <Lock className="h-5 w-5 text-gray-500" />}
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
          <p className="text-gray-300 mb-0" data-issued>
            {label} certificate <span className="font-mono text-[#BFFF00]">{result.certificate_number}</span> issued.{' '}
            <Link to="/dashboard/certificates" className="text-[#BFFF00] hover:underline inline-flex items-center gap-1">
              My certificates <ArrowRight className="h-3 w-3" />
            </Link>{' '}
            <a href={verificationUrl(result.verify_code)} target="_blank" rel="noreferrer" className="text-gray-400 hover:underline">
              Public verification
            </a>
          </p>
        )}
        {result?.passed && result.already_certified && (
          <p className="text-gray-300 mb-0" data-already>You already hold a live {label} certificate for this course.</p>
        )}
        {!result && ready && (
          <Button size="sm" onClick={onClaim} disabled={busy} className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold">
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Award className="mr-2 h-4 w-4" />}
            Issue my {label} certificate
          </Button>
        )}
        {!result && !ready && (
          <p className="text-xs text-gray-500 mb-0" data-locked>Locked until the final exam is passed.</p>
        )}
        {error && <p className="text-red-300 mb-0" data-error>{error}</p>}
      </CardContent>
    </Card>
  );
};

export default PracticeCertificateCard;
