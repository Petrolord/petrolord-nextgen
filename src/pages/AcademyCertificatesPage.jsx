import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Loader2, Award, ExternalLink, Copy, CheckCircle2,
  AlertTriangle, XCircle, Ticket,
} from 'lucide-react';
import {
  listMyCertifications, certificateStatus, verificationUrl,
  listMyBridgeCodes, bridgeCodeStatus,
} from '@/services/academyService';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import {
  courseName, CERT_TIER_LABELS, formalDate, certificateHolder, titleCaseSlug,
} from '@/lib/appNames';
import CertificateView from '@/components/academy/CertificateView';
import PracticeCourseBadge from '@/components/course/PracticeCourseBadge';
import { courseTypeOf } from '@/lib/courseType';

const STATUS_PILL = {
  valid: { cls: 'bg-pl-success-bg text-pl-success-text border-pl-success/30', icon: CheckCircle2, label: 'Valid' },
  expired: { cls: 'bg-pl-warning-bg text-pl-warning-text border-pl-warning/30', icon: AlertTriangle, label: 'Expired' },
  revoked: { cls: 'bg-pl-danger-bg text-pl-danger-text border-pl-danger/30', icon: XCircle, label: 'Revoked' },
};

// Learner-facing certificates (v2): reads academy_certifications
// (verifiable IDs + validity window), with a shareable public
// verification link and a print view. Supersedes the legacy
// `certificates` table view.
//
// Design system (batch 2A): the page chrome renders inside the signed-in
// scope on theme roles. The certificate itself keeps its designed artwork
// (owner decision, docs/scope/DesignSystem-Rollout.md section 2): the
// CertificateView overlay mounts in document.body, outside the page scope,
// so the print stylesheet can isolate the sheet. The overlay's toolbar is a
// fixed dark scope of its own and the sheet is a data-canvas="document"
// region (wave 7; see CertificateView).
function CertificateDocument({ children }) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div data-testid="certificate-document">{children}</div>,
    document.body,
  );
}
const AcademyCertificatesPage = () => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [certs, setCerts] = useState([]);
  const [bridgeCodes, setBridgeCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewCert, setViewCert] = useState(null);

  // Never an email address: without a display name the certificate asks
  // the learner to set one in Settings.
  const holderName = certificateHolder(profile?.display_name);

  useEffect(() => {
    (async () => {
      try {
        setCerts(await listMyCertifications());
        setBridgeCodes(await listMyBridgeCodes());
      } catch (e) {
        toast({ title: 'Failed to load certificates', description: e.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bridgeByCert = Object.fromEntries(bridgeCodes.map((b) => [b.certification_id, b]));

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({ title: 'Discount code copied' });
    } catch {
      toast({ title: 'Could not copy', variant: 'destructive' });
    }
  };

  const copyLink = async (verifyCode) => {
    try {
      await navigator.clipboard.writeText(verificationUrl(verifyCode));
      toast({ title: 'Verification link copied' });
    } catch {
      toast({ title: 'Could not copy', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-pl-primary-text" />
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Certificates - Petrolord NextGen Academy</title></Helmet>
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto px-4 py-6 sm:p-6 space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-pl-text flex items-center gap-2">
            <Award className="h-7 w-7 text-pl-accent-text" aria-hidden="true" /> My certificates
          </h1>
          <p className="mt-1 text-pl-muted">
            View and print each certificate, and share its public verification link so anyone can confirm it.
          </p>
          {!holderName && certs.length > 0 && (
            <p className="mt-3 rounded-md border border-pl-accent/60 bg-pl-accent/10 px-4 py-3 text-sm text-pl-text">
              Your certificates print the display name on your profile.{' '}
              <Link to="/dashboard/settings" className="font-semibold text-pl-primary-text hover:text-pl-primary-text-hover hover:underline">
                Set your display name in Settings
              </Link>{' '}
              before you print or share one.
            </p>
          )}
        </div>

        {certs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-pl-muted">
              You haven’t earned any certificates yet. Complete a course tier to certify.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {certs.map((c) => {
              const status = certificateStatus(c);
              const pill = STATUS_PILL[status];
              const bridge = bridgeByCert[c.id];
              return (
                <Card key={c.id} className="print:border-black">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-pl-text">
                            {courseName(c.app_slug, c.course_name)}
                          </h3>
                          <span className="text-pl-accent-text text-sm font-medium">
                            {CERT_TIER_LABELS[c.tier] || titleCaseSlug(c.tier)}
                          </span>
                          <PracticeCourseBadge show={courseTypeOf(c.app_slug, [{ slug: c.app_slug, course_type: c.course_type }]) === 'practice'} />
                        </div>
                        <p className="text-xs text-pl-muted font-pl-mono tabular-nums mt-1">{c.certificate_number}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs ${pill.cls}`}>
                        <pill.icon className="h-3.5 w-3.5" aria-hidden="true" /> {pill.label}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-pl-muted">Issued</p>
                        <p className="text-pl-text">{formalDate(c.issued_at)}</p>
                      </div>
                      <div>
                        <p className="text-pl-muted">Valid until</p>
                        <p className="text-pl-text">{formalDate(c.valid_until)}</p>
                      </div>
                    </div>

                    {bridge && (
                      <div className="mt-4 rounded-md border border-pl-accent/60 bg-pl-accent/10 p-4">
                        <p className="text-sm text-pl-text font-medium flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-pl-accent-text" aria-hidden="true" />
                          Suite bridge: {bridge.discount_pct}% off the {bridge.suite_module} module
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                          <span className="font-pl-mono text-pl-accent-text text-base font-semibold tracking-wider">{bridge.code}</span>
                          {bridgeCodeStatus(bridge) === 'valid' ? (
                            <Button size="sm" variant="outline" className="print:hidden"
                              onClick={() => copyCode(bridge.code)}>
                              <Copy className="h-4 w-4 mr-1" /> Copy code
                            </Button>
                          ) : (
                            <span className="text-xs text-pl-muted capitalize">{bridgeCodeStatus(bridge)}</span>
                          )}
                        </div>
                        <p className="mt-2 text-xs text-pl-muted">
                          Single use at Petrolord Suite checkout. Valid until {formalDate(bridge.valid_until)}.
                        </p>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button size="sm" className="font-semibold"
                        onClick={() => setViewCert(c)}>
                        <Award className="h-4 w-4 mr-1" /> View certificate
                      </Button>
                      <a href={verificationUrl(c.verify_code)} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4 mr-1" /> Verification page
                        </Button>
                      </a>
                      <Button size="sm" variant="outline"
                        onClick={() => copyLink(c.verify_code)}>
                        <Copy className="h-4 w-4 mr-1" /> Copy link
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </motion.div>

      {viewCert && (
        <CertificateDocument>
          <CertificateView
            cert={viewCert}
            holderName={holderName}
            onClose={() => setViewCert(null)}
          />
        </CertificateDocument>
      )}
    </>
  );
};

export default AcademyCertificatesPage;
