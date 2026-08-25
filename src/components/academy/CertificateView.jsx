import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Printer, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { verificationUrl, certificateStatus } from '@/services/academyService';
import { appName, CERT_TIER_LABELS } from '@/lib/appNames';

// Printable certificate render. Shown in a full-screen overlay; the
// print stylesheet isolates the sheet so File > Print (or the button)
// produces a clean A4 landscape document. Verification is the anchor of
// trust: the QR code and printed code resolve to the public verify page,
// so a forged print fails the scan. Expired and revoked certificates
// carry a diagonal watermark on screen AND in print.
const INK = '#0F172A';

const CertificateView = ({ cert, holderName, onClose }) => {
  const [qr, setQr] = useState(null);
  const status = certificateStatus(cert);
  const url = verificationUrl(cert.verify_code);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(url, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 320,
      color: { dark: INK, light: '#FFFFFF' },
    })
      .then((d) => { if (!cancelled) setQr(d); })
      .catch(() => { if (!cancelled) setQr(null); });
    return () => { cancelled = true; };
  }, [url]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const fmt = (d) => new Date(d).toLocaleDateString(undefined, {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const displayUrl = url.replace(/^https?:\/\//, '');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 p-4 sm:p-8">
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #certificate-sheet, #certificate-sheet * { visibility: visible !important; }
          #certificate-sheet {
            position: fixed !important; left: 0 !important; top: 0 !important;
            width: 100% !important; margin: 0 !important;
            border-radius: 0 !important; box-shadow: none !important;
          }
          @page { size: A4 landscape; margin: 10mm; }
        }
      `}</style>

      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between print:hidden">
          <p className="text-gray-300 text-sm mb-0">
            Certificate preview. Printing produces a clean A4 landscape sheet.
          </p>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => window.print()}
              className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold">
              <Printer className="h-4 w-4 mr-1" /> Print
            </Button>
            <Button size="sm" variant="outline" onClick={onClose}
              className="border-gray-500 text-gray-200">
              <X className="h-4 w-4 mr-1" /> Close
            </Button>
          </div>
        </div>

        <div
          id="certificate-sheet"
          className="relative mx-auto aspect-[297/210] w-full max-w-5xl overflow-hidden rounded-sm bg-white text-[#0F172A] shadow-2xl"
          style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
        >
          {/* frame */}
          <div className="absolute inset-3 border-2 border-[#0F172A]" />
          <div className="absolute inset-4 border border-[#0F172A]/30" />
          <div className="absolute inset-x-3 top-3 h-1.5 bg-[#BFFF00]" />

          {status !== 'valid' && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <span className={`-rotate-[24deg] select-none text-[16vmin] font-black uppercase tracking-widest opacity-15 ${status === 'revoked' ? 'text-red-700' : 'text-amber-600'}`}>
                {status}
              </span>
            </div>
          )}

          <div className="relative flex h-full flex-col px-[7%] py-[5%]">
            <div className="text-center">
              <p className="text-[1.6vmin] font-semibold uppercase tracking-[0.5em] text-[#0F172A]/70 mb-0">
                Petrolord NextGen Academy
              </p>
              <h1 className="mt-[1.5vmin] font-serif text-[5vmin] font-bold leading-tight">
                Certificate of Certification
              </h1>
              <div className="mx-auto mt-[1vmin] h-px w-1/3 bg-[#0F172A]/40" />
            </div>

            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <p className="text-[2vmin] text-[#0F172A]/70 mb-0">This certifies that</p>
              <p className="mt-[1vmin] border-b border-[#0F172A]/40 px-[4vmin] pb-[0.8vmin] font-serif text-[4.4vmin] italic leading-tight mb-0">
                {holderName}
              </p>
              <p className="mt-[2vmin] text-[2vmin] text-[#0F172A]/70 mb-0">
                has met the certification requirements of the course
              </p>
              <p className="mt-[0.8vmin] text-[3.2vmin] font-bold leading-tight mb-0">
                {appName(cert.app_slug)}
              </p>
              <p className="mt-[0.4vmin] text-[2.4vmin] font-semibold uppercase tracking-[0.25em] text-[#0F172A]/80 mb-0">
                {CERT_TIER_LABELS[cert.tier] || cert.tier} level
              </p>
              <p className="mt-[2vmin] text-[1.8vmin] text-[#0F172A]/70 mb-0">
                Issued {fmt(cert.issued_at)} and valid until {fmt(cert.valid_until)}
              </p>
            </div>

            <div className="flex items-end justify-between gap-[3vmin]">
              <div className="text-left">
                <div className="w-[24vmin] border-t border-[#0F172A]/60 pt-[0.8vmin]">
                  <p className="text-[1.7vmin] font-semibold mb-0">Registrar</p>
                  <p className="text-[1.5vmin] text-[#0F172A]/60 mb-0">Petrolord NextGen Academy</p>
                </div>
              </div>
              <div className="flex-1 text-center">
                <p className="font-mono text-[1.8vmin] mb-0">{cert.certificate_number}</p>
                <p className="text-[1.4vmin] text-[#0F172A]/60 mb-0">
                  Verify at {displayUrl}
                </p>
              </div>
              <div className="text-right">
                {qr ? (
                  <img src={qr} alt="Verification QR code" className="ml-auto h-[13vmin] w-[13vmin]" />
                ) : (
                  <div className="ml-auto flex h-[13vmin] w-[13vmin] items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[#0F172A]/40" />
                  </div>
                )}
                <p className="mt-[0.4vmin] font-mono text-[1.3vmin] text-[#0F172A]/60 mb-0">{cert.verify_code}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
