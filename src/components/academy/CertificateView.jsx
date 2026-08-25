import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Printer, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { verificationUrl, certificateStatus } from '@/services/academyService';
import { appName, CERT_TIER_LABELS } from '@/lib/appNames';
import nextgenWordmark from '@/assets/certificates/nextgen-wordmark.png';
import lordswayLogo from '@/assets/certificates/lordsway-logo.png';
import authorisedSignature from '@/assets/certificates/authorised-signature.png';

// Printable certificate render (premium design, owner-approved samples
// 2026-08-25). Shown in a full-screen overlay; the print stylesheet
// isolates the sheet so File > Print (or the button) produces a clean
// A4 landscape document. The sheet is a fixed 1123x794 canvas (A4
// landscape at 96dpi) scaled to fit the viewport on screen and printed
// unscaled. Verification is the anchor of trust: the QR code and
// printed code resolve to the public verify page, so a forged print
// fails the scan. Expired and revoked certificates carry a diagonal
// status watermark on screen AND in print.
const INK = '#18320e';
const SHEET_W = 1123;
const SHEET_H = 794;

const CertificateView = ({ cert, holderName, onClose }) => {
  const [qr, setQr] = useState(null);
  const [scale, setScale] = useState(1);
  const frameRef = useRef(null);
  const status = certificateStatus(cert);
  const url = verificationUrl(cert.verify_code);
  const tier = CERT_TIER_LABELS[cert.tier] ? cert.tier : 'associate';
  const tierLabel = CERT_TIER_LABELS[cert.tier] || cert.tier;

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

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return undefined;
    const fit = () => setScale(Math.min(1, el.clientWidth / SHEET_W));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fmt = (d) => new Date(d).toLocaleDateString(undefined, {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const displayUrl = url.replace(/^https?:\/\//, '');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 p-4 sm:p-8">
      <style>{`
        #certificate-sheet{
          --ink:#18320e; --gold:#f9bd00; --lime:#9adf22; --green:#5f990d;
          --brand-font:"Trebuchet MS","Arial Rounded MT Bold","Segoe UI",Arial,sans-serif;
          --serif:Georgia,"Times New Roman",serif;
          position:relative;width:${SHEET_W}px;height:${SHEET_H}px;overflow:hidden;
          transform-origin:top left;
          background:
            linear-gradient(115deg,rgba(249,189,0,.028),transparent 31%),
            radial-gradient(circle at 50% 48%,#fff 0,#fffdf6 58%,#fbf7ea 100%);
          color:#17230f;box-shadow:0 28px 70px rgba(0,0,0,.48);
          print-color-adjust:exact;-webkit-print-color-adjust:exact;
          font-family:var(--brand-font);
        }
        #certificate-sheet p{margin:0}
        #certificate-sheet .outerframe{position:absolute;inset:14px;border:2px solid var(--ink);pointer-events:none;z-index:7}
        #certificate-sheet .goldframe{position:absolute;inset:19px;border:1px solid var(--gold);pointer-events:none;z-index:7}
        #certificate-sheet .innerframe{position:absolute;inset:25px;border:1px solid rgba(63,114,5,.30);pointer-events:none;z-index:7}
        #certificate-sheet .corner{position:absolute;width:280px;height:280px;opacity:.16;pointer-events:none}
        #certificate-sheet .corner.tl{left:-92px;top:-98px;background:repeating-radial-gradient(circle at center,transparent 0 14px,rgba(95,153,13,.55) 15px 17px,transparent 18px 27px,rgba(249,189,0,.52) 28px 30px,transparent 31px 42px);transform:rotate(18deg)}
        #certificate-sheet .corner.br{right:-100px;bottom:-104px;background:repeating-radial-gradient(circle at center,transparent 0 14px,rgba(249,189,0,.52) 15px 17px,transparent 18px 28px,rgba(95,153,13,.50) 29px 31px,transparent 32px 44px);transform:rotate(-22deg)}
        #certificate-sheet .side-accent{position:absolute;left:25px;top:25px;bottom:25px;width:7px;background:linear-gradient(180deg,var(--lime),var(--gold) 50%,var(--green));z-index:8}
        #certificate-sheet .top-glint{position:absolute;left:25px;right:25px;top:25px;height:4px;background:linear-gradient(90deg,var(--green),var(--lime) 28%,var(--gold) 56%,var(--green));z-index:8}
        #certificate-sheet .watermark-logo{position:absolute;left:50%;top:47%;width:370px;transform:translate(-50%,-50%);opacity:.028;filter:grayscale(1);pointer-events:none;z-index:0}
        #certificate-sheet .content{position:relative;height:100%;padding:44px 62px 42px 72px;z-index:2;display:flex;flex-direction:column}
        #certificate-sheet .brand-row{height:95px;display:flex;align-items:flex-start;justify-content:space-between;gap:32px}
        #certificate-sheet .nextgen{width:360px;height:72px;object-fit:contain;object-position:left center;filter:drop-shadow(0 2px 0 rgba(0,0,0,.04))}
        #certificate-sheet .parent{display:flex;align-items:center;gap:12px;text-align:right;min-width:265px;justify-content:flex-end}
        #certificate-sheet .parent-copy{display:flex;flex-direction:column;align-items:flex-end}
        #certificate-sheet .parent-kicker{font-size:9.5px;letter-spacing:.24em;text-transform:uppercase;color:#6a745f;font-weight:800}
        #certificate-sheet .parent-name{font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink);font-weight:900;margin-top:3px}
        #certificate-sheet .parent-logo{width:62px;height:56px;object-fit:contain}
        #certificate-sheet .title-wrap{text-align:center;margin-top:1px}
        #certificate-sheet .eyebrow{font-size:10px;font-weight:900;letter-spacing:.42em;text-transform:uppercase;color:var(--green);margin:0 0 8px}
        #certificate-sheet h1{font-family:var(--serif);font-weight:600;font-size:39px;letter-spacing:.015em;margin:0;color:#15200f;line-height:1.05}
        #certificate-sheet .title-line{width:245px;height:2px;margin:11px auto 0;background:linear-gradient(90deg,transparent,var(--gold),var(--green),var(--gold),transparent)}
        #certificate-sheet .award{flex:1;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;padding-bottom:3px}
        #certificate-sheet .certifies{font-size:13.5px;letter-spacing:.08em;color:#63705e;margin:0 0 8px}
        #certificate-sheet .holder{font-family:var(--serif);font-size:43px;line-height:1.05;font-weight:600;font-style:italic;color:#1f3514;margin:0;padding:0 34px 8px;min-width:520px;border-bottom:1px solid rgba(95,153,13,.42);text-shadow:0 1px 0 #fff}
        #certificate-sheet .statement{font-size:13.5px;color:#65705e;margin:14px 0 5px}
        #certificate-sheet .course{font-size:27px;line-height:1.1;color:#17280d;font-weight:900;margin:0;letter-spacing:.01em}
        #certificate-sheet .tier-badge{margin-top:10px;padding:7px 18px 6px;border-radius:999px;border:1px solid var(--tier-border);background:var(--tier-bg);color:var(--tier-ink);font-size:11px;line-height:1;font-weight:900;letter-spacing:.26em;text-transform:uppercase;box-shadow:inset 0 0 0 1px rgba(255,255,255,.7)}
        #certificate-sheet .dates{font-size:12.5px;color:#697363;margin-top:11px;letter-spacing:.015em}
        #certificate-sheet.associate{--tier-bg:linear-gradient(180deg,#f5ffe7,#e6f8c7);--tier-border:#8ec72c;--tier-ink:#497608;--seal1:#8fce21;--seal2:#5f990d}
        #certificate-sheet.professional{--tier-bg:linear-gradient(180deg,#fff7cf,#ffed9b);--tier-border:#e5b100;--tier-ink:#816100;--seal1:#f9bd00;--seal2:#d39c00}
        #certificate-sheet.expert{--tier-bg:linear-gradient(180deg,#edf6df,#d7ebbb);--tier-border:#527d19;--tier-ink:#24470a;--seal1:#507f10;--seal2:#274d09}
        #certificate-sheet .footer{height:128px;border-top:1px solid rgba(57,91,30,.20);display:flex;align-items:flex-end;gap:22px;padding-top:17px;position:relative}
        #certificate-sheet .footer:before{content:"PETROLORD NEXTGEN ACADEMY \\2022  PROFESSIONAL ENERGY LEARNING \\2022  PETROLORD NEXTGEN ACADEMY \\2022  PROFESSIONAL ENERGY LEARNING";position:absolute;left:0;right:0;top:4px;white-space:nowrap;overflow:hidden;font-size:6.8px;letter-spacing:.26em;color:rgba(65,99,37,.24);font-weight:900}
        #certificate-sheet .signature{padding-bottom:7px;width:31%;flex:0 0 31%;position:relative}
        #certificate-sheet .sig-image{display:block;width:148px;height:auto;margin:0 0 -20px 38px;position:relative;z-index:1}
        #certificate-sheet .sig-line{width:225px;border-top:1px solid #536149;margin-bottom:7px;position:relative;z-index:2}
        #certificate-sheet .sig-role{font-size:12.3px;font-weight:900;color:#263c18;margin:0}
        #certificate-sheet .sig-org{font-size:9.8px;color:#717a69;margin-top:2px;letter-spacing:.02em}
        #certificate-sheet .credential{text-align:center;align-self:center;padding-bottom:4px;width:37%;flex:0 0 37%;min-width:0}
        #certificate-sheet .certno{font-size:13px;font-family:ui-monospace,"SFMono-Regular",Consolas,monospace;font-weight:700;letter-spacing:.08em;margin:0;color:#263a19}
        #certificate-sheet .verify{font-size:9.4px;color:#6d7767;margin:5px 0 0;overflow-wrap:anywhere;word-break:break-word}
        #certificate-sheet .security{font-size:8px;letter-spacing:.14em;color:#85907f;text-transform:uppercase;margin-top:5px}
        #certificate-sheet .rightblock{display:flex;justify-content:flex-end;align-items:center;gap:15px;width:32%;flex:0 0 32%}
        #certificate-sheet .seal{position:relative;width:88px;height:88px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 45%,#fffdf4 0 37%,transparent 38%),conic-gradient(from 0deg,var(--seal1),var(--gold),var(--seal2),var(--gold),var(--seal1));box-shadow:0 0 0 2px #fff,0 0 0 3px rgba(61,87,41,.25),inset 0 0 0 7px #fffdf5}
        #certificate-sheet .seal:before{content:"CERTIFIED";position:absolute;top:17px;font-size:8px;letter-spacing:.16em;font-weight:900;color:#294617}
        #certificate-sheet .seal:after{content:attr(data-tier);position:absolute;bottom:15px;font-size:7.5px;letter-spacing:.13em;font-weight:900;color:#294617;text-transform:uppercase}
        #certificate-sheet .seal-core{width:32px;height:32px;border-radius:50%;background:linear-gradient(145deg,var(--gold),#ffd85a);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;color:#3b5a1e;box-shadow:0 0 0 3px #fffdf7,0 0 0 4px rgba(92,139,24,.35)}
        #certificate-sheet .qrwrap{text-align:center}
        #certificate-sheet .qrwrap img{display:block;width:82px;height:82px;padding:4px;background:#fff;border:1px solid rgba(50,80,30,.20)}
        #certificate-sheet .qr-pending{display:flex;width:82px;height:82px;align-items:center;justify-content:center;background:#fff;border:1px solid rgba(50,80,30,.20)}
        #certificate-sheet .qrcode{font-family:ui-monospace,Consolas,monospace;font-size:7.7px;color:#7a8373;margin-top:3px;letter-spacing:.04em}
        #certificate-sheet .status-watermark{position:absolute;z-index:10;left:-80px;right:-80px;top:345px;transform:rotate(-17deg);text-align:center;font-size:104px;font-weight:1000;letter-spacing:.12em;color:rgba(163,48,31,.14);text-transform:uppercase;pointer-events:none;border-top:4px solid rgba(163,48,31,.09);border-bottom:4px solid rgba(163,48,31,.09);line-height:1.25}
        #certificate-sheet.lapsed{filter:saturate(.78)}
        @media print {
          body * { visibility: hidden !important; }
          #certificate-sheet, #certificate-sheet * { visibility: visible !important; }
          #certificate-sheet {
            position: fixed !important; left: 0 !important; top: 0 !important;
            margin: 0 !important; transform: none !important; box-shadow: none !important;
          }
          @page { size: A4 landscape; margin: 0; }
        }
      `}</style>

      <div className="mx-auto" style={{ maxWidth: `${SHEET_W}px` }}>
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

        <div ref={frameRef} style={{ height: `${SHEET_H * scale}px` }}>
          <div
            id="certificate-sheet"
            className={`${tier}${status !== 'valid' ? ' lapsed' : ''}`}
            style={{ transform: `scale(${scale})` }}
          >
            <div className="outerframe" /><div className="goldframe" /><div className="innerframe" />
            <div className="side-accent" /><div className="top-glint" />
            <div className="corner tl" /><div className="corner br" />
            <img className="watermark-logo" src={lordswayLogo} alt="" />
            {status !== 'valid' && (
              <div className="status-watermark">{status}</div>
            )}

            <main className="content">
              <header className="brand-row">
                <img className="nextgen" src={nextgenWordmark} alt="Petrolord NextGen Academy" />
                <div className="parent">
                  <div className="parent-copy">
                    <span className="parent-kicker">A professional learning initiative of</span>
                    <span className="parent-name">Lordsway Energy</span>
                  </div>
                  <img className="parent-logo" src={lordswayLogo} alt="Lordsway Energy" />
                </div>
              </header>
              <section className="title-wrap">
                <p className="eyebrow">Professional Credential</p>
                <h1>Certificate of Professional Certification</h1>
                <div className="title-line" />
              </section>
              <section className="award">
                <p className="certifies">Petrolord NextGen Academy proudly certifies that</p>
                <p className="holder">{holderName}</p>
                <p className="statement">has successfully met the requirements for certification in</p>
                <p className="course">{appName(cert.app_slug)}</p>
                <div className="tier-badge">{tierLabel} Level</div>
                <div className="dates">
                  Issued {fmt(cert.issued_at)} &nbsp;&bull;&nbsp; Valid until {fmt(cert.valid_until)}
                </div>
              </section>
              <footer className="footer">
                <div className="signature">
                  <img className="sig-image" src={authorisedSignature} alt="Authorised signature" />
                  <div className="sig-line" />
                  <p className="sig-role">Registrar / Authorised Signatory</p>
                  <p className="sig-org">Petrolord NextGen Academy</p>
                </div>
                <div className="credential">
                  <p className="certno">{cert.certificate_number}</p>
                  <p className="verify">Verify at {displayUrl}</p>
                  <div className="security">Digitally verifiable credential &bull; Scan QR to authenticate</div>
                </div>
                <div className="rightblock">
                  <div className="seal" data-tier={tierLabel}><div className="seal-core">PNA</div></div>
                  <div className="qrwrap">
                    {qr ? (
                      <img src={qr} alt="Verification QR code" />
                    ) : (
                      <div className="qr-pending">
                        <Loader2 className="h-6 w-6 animate-spin text-[#0F172A]/40" />
                      </div>
                    )}
                    <div className="qrcode">{cert.verify_code}</div>
                  </div>
                </div>
              </footer>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
