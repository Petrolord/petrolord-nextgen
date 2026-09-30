import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Loader2, ShieldCheck, ShieldX, ShieldAlert, Search, GraduationCap,
} from 'lucide-react';
import { verifyCertificate } from '@/services/academyService';
import {
  courseName, CERT_TIER_LABELS as TIER_LABEL, formalDate, titleCaseSlug,
} from '@/lib/appNames';
import PracticeCourseBadge from '@/components/course/PracticeCourseBadge';
import { courseTypeOf } from '@/lib/courseType';
import { cn } from '@/lib/utils';
import { PublicPage, AUTH_CARD, AUTH_COLUMN, AUTH_TITLE, TEXT_LINK } from '@/components/public/PublicPage';

// Status colour always comes with its word (the label).
const STATUS = {
  valid: { icon: ShieldCheck, color: 'text-pl-success-text', border: 'border-pl-success/50', label: 'Valid certificate' },
  expired: { icon: ShieldAlert, color: 'text-pl-warning-text', border: 'border-pl-warning/50', label: 'Certificate expired' },
  revoked: { icon: ShieldX, color: 'text-pl-danger-text', border: 'border-pl-danger/50', label: 'Certificate revoked' },
};

// Public, no-auth verification page. Reads a verify_code from the path
// (/verify/:code) or the ?code query and calls the anon-executable
// academy_verify_certificate RPC.
const VerifyCertificatePage = () => {
  const { code: codeParam } = useParams();
  const [searchParams] = useSearchParams();
  const initial = codeParam || searchParams.get('code') || '';
  const [code, setCode] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [checked, setChecked] = useState(false);

  const runVerify = async (value) => {
    const c = (value ?? code).trim();
    if (!c) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    try {
      const data = await verifyCertificate(c);
      if (!data || !data.certificate_number) setNotFound(true);
      else setResult(data);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
      setChecked(true);
    }
  };

  useEffect(() => {
    if (initial) runVerify(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  const s = result ? STATUS[result.status] || STATUS.revoked : null;

  return (
    <>
      <Helmet><title>Verify certificate - Petrolord NextGen Academy</title></Helmet>
      <PublicPage testId="verify-theme-scope" mainClassName={AUTH_COLUMN}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg space-y-6"
        >
          <div className="text-center">
            <h1 className={AUTH_TITLE}>Certificate verification</h1>
            <p className="mt-2 text-sm text-pl-muted">
              Enter a certificate’s verification code to confirm it was issued by Petrolord NextGen Academy.
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              value={code} onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runVerify()}
              placeholder="Verification code"
              aria-label="Verification code"
              className="font-pl-mono"
            />
            <Button
              onClick={() => runVerify()} disabled={loading || !code.trim()}
              aria-label="Verify certificate"
              className="shrink-0 font-semibold"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          {notFound && checked && (
            <div role="status" className="rounded-lg border border-pl-danger/40 bg-pl-danger-bg p-5 text-center">
              <ShieldX className="mx-auto h-8 w-8 text-pl-danger-text" />
              <p className="mt-2 font-medium text-pl-text">No certificate found</p>
              <p className="text-sm text-pl-muted">
                This code doesn’t match any certificate on record. Check the code and try again.
              </p>
            </div>
          )}

          {result && s && (
            <div className={cn(AUTH_CARD, s.border)} data-testid="verify-result" data-status={result.status}>
              <div className="flex items-center gap-3">
                <s.icon className={`h-8 w-8 shrink-0 ${s.color}`} />
                <div className="min-w-0">
                  <p className={`font-semibold ${s.color}`}>{s.label}</p>
                  <p className="break-all font-pl-mono text-xs text-pl-muted">{result.certificate_number}</p>
                </div>
              </div>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-pl-border pb-2">
                  <dt className="text-pl-muted">Holder</dt>
                  <dd className="text-right font-medium text-pl-text">{result.holder}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-pl-border pb-2">
                  <dt className="text-pl-muted">Course</dt>
                  <dd className="text-right text-pl-text">
                    {courseName(result.app_slug, result.course_name)}
                    <PracticeCourseBadge show={courseTypeOf(result.app_slug, [{ slug: result.app_slug, course_type: result.course_type }]) === 'practice'} />
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-pl-border pb-2">
                  <dt className="text-pl-muted">Certification</dt>
                  <dd className="flex items-center gap-1 text-pl-text">
                    <GraduationCap className="h-4 w-4 text-pl-accent-text" />
                    {TIER_LABEL[result.tier] || titleCaseSlug(result.tier)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-pl-border pb-2">
                  <dt className="text-pl-muted">Issued</dt>
                  <dd className="text-pl-text">{formalDate(result.issued_at)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-pl-muted">Valid until</dt>
                  <dd className="text-pl-text">{formalDate(result.valid_until)}</dd>
                </div>
              </dl>
            </div>
          )}

          <p className="text-center text-xs text-pl-muted">
            <Link to="/" className={TEXT_LINK}>Petrolord NextGen Academy</Link>
          </p>
        </motion.div>
      </PublicPage>
    </>
  );
};

export default VerifyCertificatePage;
