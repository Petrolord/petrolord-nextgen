import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Loader2, Award, ExternalLink, Copy, Printer, CheckCircle2,
  AlertTriangle, XCircle,
} from 'lucide-react';
import {
  listMyCertifications, certificateStatus, verificationUrl,
} from '@/services/academyService';

const APP_NAMES = {
  welldata: 'Well Data Manager', petrophysics: 'Petrophysics',
  wellcorrelation: 'Well Correlation', seismolord: 'Seismolord',
  mapping: 'Mapping', reservoircalc: 'ReservoirCalc Pro',
};
const TIER_LABEL = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };
const STATUS_PILL = {
  valid: { cls: 'bg-emerald-900/40 text-emerald-300 border-emerald-700', icon: CheckCircle2, label: 'Valid' },
  expired: { cls: 'bg-yellow-900/40 text-yellow-300 border-yellow-700', icon: AlertTriangle, label: 'Expired' },
  revoked: { cls: 'bg-red-900/40 text-red-300 border-red-700', icon: XCircle, label: 'Revoked' },
};

// Learner-facing certificates (v2): reads academy_certifications
// (verifiable IDs + validity window), with a shareable public
// verification link and a print view. Supersedes the legacy
// `certificates` table view.
const AcademyCertificatesPage = () => {
  const { toast } = useToast();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setCerts(await listMyCertifications());
      } catch (e) {
        toast({ title: 'Failed to load certificates', description: e.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyLink = async (verifyCode) => {
    try {
      await navigator.clipboard.writeText(verificationUrl(verifyCode));
      toast({ title: 'Verification link copied', className: 'bg-[#BFFF00] text-slate-900' });
    } catch {
      toast({ title: 'Could not copy', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#BFFF00]" />
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Certificates - Petrolord NextGen Academy</title></Helmet>
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto p-6 space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Award className="h-7 w-7 text-[#BFFF00]" /> My certificates
          </h1>
          <p className="mt-1 text-gray-400">
            Each certificate has a public verification page — share the link and anyone can confirm it.
          </p>
        </div>

        {certs.length === 0 ? (
          <Card className="bg-[#1E293B] border-gray-700">
            <CardContent className="py-12 text-center text-gray-500">
              You haven’t earned any certificates yet. Complete a course tier to certify.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {certs.map((c) => {
              const status = certificateStatus(c);
              const pill = STATUS_PILL[status];
              return (
                <Card key={c.id} className="bg-[#1E293B] border-gray-700 print:border-black">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">
                            {APP_NAMES[c.app_slug] || c.app_slug}
                          </h3>
                          <span className="text-[#BFFF00] text-sm font-medium">
                            {TIER_LABEL[c.tier] || c.tier}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-mono mt-1">{c.certificate_number}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs ${pill.cls}`}>
                        <pill.icon className="h-3.5 w-3.5" /> {pill.label}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Issued</p>
                        <p className="text-white">{new Date(c.issued_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Valid until</p>
                        <p className="text-white">{new Date(c.valid_until).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 print:hidden">
                      <a href={verificationUrl(c.verify_code)} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="outline" className="border-[#BFFF00] text-[#BFFF00] hover:bg-[#BFFF00] hover:text-[#0F172A]">
                          <ExternalLink className="h-4 w-4 mr-1" /> Verification page
                        </Button>
                      </a>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300"
                        onClick={() => copyLink(c.verify_code)}>
                        <Copy className="h-4 w-4 mr-1" /> Copy link
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300"
                        onClick={() => window.print()}>
                        <Printer className="h-4 w-4 mr-1" /> Print
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default AcademyCertificatesPage;
