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

const APP_NAMES = {
  welldata: 'Well Data Manager',
  petrophysics: 'Petrophysics',
  wellcorrelation: 'Well Correlation',
  seismolord: 'Seismolord',
  mapping: 'Mapping',
  reservoircalc: 'ReservoirCalc Pro',
};
const TIER_LABEL = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const STATUS = {
  valid: { icon: ShieldCheck, color: 'text-[#BFFF00]', border: 'border-[#BFFF00]', label: 'Valid certificate' },
  expired: { icon: ShieldAlert, color: 'text-yellow-400', border: 'border-yellow-600', label: 'Certificate expired' },
  revoked: { icon: ShieldX, color: 'text-red-400', border: 'border-red-700', label: 'Certificate revoked' },
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
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A] py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg w-full space-y-6"
        >
          <div className="text-center">
            <img
              className="mx-auto h-14 w-auto object-contain"
              src="https://horizons-cdn.hostinger.com/80504870-35f5-4fc9-ba7f-f8bc12cf282f/petrolord-symbol-512-7N6nn.png"
              alt="Petrolord NextGen Academy"
            />
            <h1 className="mt-4 text-2xl font-bold text-white">Certificate verification</h1>
            <p className="mt-1 text-sm text-gray-400">
              Enter a certificate’s verification code to confirm it was issued by Petrolord NextGen Academy.
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              value={code} onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runVerify()}
              placeholder="Verification code"
              className="bg-gray-700 text-white border-gray-600 font-mono"
            />
            <Button
              onClick={() => runVerify()} disabled={loading || !code.trim()}
              className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold shrink-0"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          {notFound && checked && (
            <div className="rounded-lg border border-red-800 bg-red-900/20 p-5 text-center">
              <ShieldX className="h-8 w-8 text-red-400 mx-auto" />
              <p className="mt-2 text-white font-medium">No certificate found</p>
              <p className="text-sm text-gray-400">
                This code doesn’t match any certificate on record. Check the code and try again.
              </p>
            </div>
          )}

          {result && s && (
            <div className={`rounded-lg border ${s.border} bg-[#1E293B] p-6`}>
              <div className="flex items-center gap-3">
                <s.icon className={`h-8 w-8 ${s.color}`} />
                <div>
                  <p className={`font-semibold ${s.color}`}>{s.label}</p>
                  <p className="text-xs text-gray-500 font-mono">{result.certificate_number}</p>
                </div>
              </div>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <dt className="text-gray-400">Holder</dt>
                  <dd className="text-white font-medium">{result.holder}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <dt className="text-gray-400">Course</dt>
                  <dd className="text-white">{APP_NAMES[result.app_slug] || result.app_slug}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <dt className="text-gray-400">Certification</dt>
                  <dd className="text-white flex items-center gap-1">
                    <GraduationCap className="h-4 w-4 text-[#BFFF00]" />
                    {TIER_LABEL[result.tier] || result.tier}
                  </dd>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <dt className="text-gray-400">Issued</dt>
                  <dd className="text-white">{new Date(result.issued_at).toLocaleDateString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">Valid until</dt>
                  <dd className="text-white">{new Date(result.valid_until).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>
          )}

          <p className="text-center text-xs text-gray-600">
            <Link to="/" className="hover:text-gray-400">Petrolord NextGen Academy</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default VerifyCertificatePage;
