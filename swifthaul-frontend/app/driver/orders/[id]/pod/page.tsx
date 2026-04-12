'use client';

import { use, useState, useRef } from 'react';
import Link from 'next/link';
import {
  Camera,
  Upload,
  Info,
  Lightbulb,
  CheckCircle2,
  ChevronLeft,
  RotateCcw,
  Package,
  AlertTriangle,
  X,
  RefreshCw,
} from 'lucide-react';
import { DriverTopbar } from '@/components/driver/driver-topbar';
import { ReportFailedModal } from '@/components/driver/report-failed-modal';
import { POD } from '@/constants/pod';
import { MOCK_POD_ORDER } from '@/constants/pod-mock';
import type { PodStep } from '@/types/pod';

function StepDots({ current }: { current: 0 | 1 | 2 }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-5">
      {([0, 1, 2] as const).map(i => (
        <span
          key={i}
          className={`rounded-full transition-all ${
            i === current ? 'w-5 h-2 bg-primary-light' : 'w-2 h-2 bg-border-strong'
          }`}
        />
      ))}
    </div>
  );
}

export default function DriverPodPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const order = { ...MOCK_POD_ORDER, referenceId: id };

  const [step, setStep] = useState<PodStep>('photo');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [hasSigned, setHasSigned] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // ── Photo file handling ──────────────────────────────────
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Revoke previous URL to avoid memory leak
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(URL.createObjectURL(file));
    // Reset input so same file can be re-selected
    e.target.value = '';
  }

  function retakePhoto() {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(null);
  }

  // ── Canvas drawing helpers ───────────────────────────────
  function getCanvasPos(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function startDraw(e: React.MouseEvent<HTMLCanvasElement>) {
    isDrawing.current = true;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function draw(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasPos(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    setHasSigned(true);
  }

  function endDraw() {
    isDrawing.current = false;
  }

  function clearSignature() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  }

  return (
    <>
      <DriverTopbar backHref={`/driver/orders/${id}`} title={POD.PAGE_TITLE} />

      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Desktop: centered card. Mobile: full-page scroll with bottom-nav padding */}
      <div className="py-4 sm:py-10 sm:flex sm:justify-center sm:px-4">
        <div className="w-full sm:max-w-md bg-surface sm:rounded-2xl sm:border sm:border-border sm:shadow-xl overflow-hidden">

          {/* ═══════════════════════════════════════════════ */}
          {/* STEP 1 — PHOTO                                  */}
          {/* ═══════════════════════════════════════════════ */}
          {step === 'photo' && (
            <div className="p-6 pb-24 sm:pb-6 space-y-4">
              <StepDots current={0} />

              <div>
                <h2 className="text-xl font-bold text-text-primary">{POD.PHOTO_TITLE}</h2>
                <p className="text-sm text-text-secondary mt-1">{POD.PHOTO_SUBTITLE}</p>
              </div>

              {/* Order ID + status */}
              <div className="flex items-center justify-between bg-surface-elevated rounded-lg px-4 py-2.5 border border-border">
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                  {POD.ORDER_ID_LABEL}{' '}
                  <span className="font-mono text-primary-light text-xs">{order.referenceId}</span>
                </p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700 tracking-wide uppercase">
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Camera viewfinder / photo preview */}
              {photoUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-border" style={{ aspectRatio: '4/3' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoUrl} alt="Captured delivery photo" className="w-full h-full object-cover" />
                  <button
                    onClick={retakePhoto}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                    aria-label="Retake photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-3 py-2 bg-black/50 text-white text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    Photo ready
                  </div>
                </div>
              ) : (
                <div
                  className="relative rounded-xl overflow-hidden border-2 border-border"
                  style={{ aspectRatio: '4/3', backgroundColor: '#D1D5DB' }}
                >
                  {/* Corner brackets */}
                  {[
                    'top-2 left-2 border-t-2 border-l-2',
                    'top-2 right-2 border-t-2 border-r-2',
                    'bottom-2 left-2 border-b-2 border-l-2',
                    'bottom-2 right-2 border-b-2 border-r-2',
                  ].map((cls, i) => (
                    <span key={i} className={`absolute w-5 h-5 border-white ${cls}`} />
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="w-16 h-16 text-white/30" />
                  </div>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/70 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
                    {POD.LIVE_VIEW}
                  </div>
                </div>
              )}

              {/* Hint */}
              <div className="flex items-start gap-2 text-xs text-text-secondary">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-text-muted" />
                <span>{POD.PHOTO_HINT}</span>
              </div>

              {/* Action buttons */}
              {photoUrl ? (
                <>
                  <button
                    onClick={() => setStep('signature')}
                    className="w-full h-12 rounded-xl bg-primary-light hover:bg-primary-hover text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Use This Photo
                  </button>
                  <button
                    onClick={retakePhoto}
                    className="w-full h-11 rounded-xl border border-border text-text-secondary text-sm font-medium hover:bg-surface-elevated transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retake
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="w-full h-12 rounded-xl bg-primary-light hover:bg-primary-hover text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    {POD.TAKE_PHOTO}
                  </button>
                  <button
                    onClick={() => galleryInputRef.current?.click()}
                    className="w-full h-11 rounded-xl border border-border text-text-secondary text-sm font-medium hover:bg-surface-elevated transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {POD.UPLOAD_GALLERY}
                  </button>
                </>
              )}

              {/* Pro tip (mobile only) */}
              <div className="sm:hidden flex items-start gap-2.5 bg-primary-subtle rounded-xl p-4">
                <Lightbulb className="w-4 h-4 text-primary-light shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold text-primary-light uppercase tracking-wider mb-0.5">{POD.PRO_TIP_LABEL}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{POD.PRO_TIP_TEXT}</p>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════ */}
          {/* STEP 2 — SIGNATURE                              */}
          {/* ═══════════════════════════════════════════════ */}
          {step === 'signature' && (
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-text-primary">{POD.SIG_TITLE}</h2>
                <p className="text-sm text-text-secondary mt-1">{POD.SIG_SUBTITLE}</p>
              </div>

              {/* Order + recipient info box */}
              <div className="rounded-lg border border-border bg-surface-elevated px-4 py-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-0.5">{POD.SIG_ORDER_LABEL}</p>
                  <p className="font-mono text-sm font-bold text-primary-light">{order.referenceId}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-0.5">{POD.SIG_RECIP_LABEL}</p>
                  <p className="text-sm font-semibold text-text-primary">{order.recipientName}</p>
                </div>
              </div>

              {/* Signature canvas */}
              <div className="relative rounded-xl border-2 border-dashed border-border bg-surface-elevated overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={180}
                  className="w-full touch-none cursor-crosshair"
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                />
                {!hasSigned && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-16 h-px bg-border-strong mb-2" />
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">{POD.SIG_PLACEHOLDER}</p>
                  </div>
                )}
              </div>

              {/* Clear + Skip links */}
              <div className="flex items-center justify-between">
                <button
                  onClick={clearSignature}
                  className="flex items-center gap-1 text-sm font-semibold text-primary-light hover:text-primary-hover transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {POD.SIG_CLEAR}
                </button>
                <button
                  onClick={() => setStep('confirmed')}
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  {POD.SIG_SKIP}
                </button>
              </div>

              <StepDots current={1} />

              {/* Nav buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep('photo')}
                  className="flex items-center gap-1.5 h-11 px-5 rounded-xl border border-border text-text-secondary text-sm font-medium hover:bg-surface-elevated transition-colors shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {POD.BACK_TO_PHOTO}
                </button>
                <button
                  onClick={() => setStep('confirmed')}
                  className="flex-1 h-11 rounded-xl bg-success hover:bg-emerald-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {POD.CONFIRM_DELIVERY}
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════ */}
          {/* STEP 3 — CONFIRMATION                           */}
          {/* ═══════════════════════════════════════════════ */}
          {step === 'confirmed' && (
            <div className="p-6 space-y-4">
              <div className="flex flex-col items-center text-center py-2">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-9 h-9 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">{POD.CONF_TITLE}</h2>
                <p className="text-sm text-text-secondary leading-relaxed max-w-xs">{POD.CONF_SUBTITLE}</p>
              </div>

              {/* Tracking ID */}
              <div className="bg-surface-elevated rounded-xl border border-border px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">{POD.CONF_TRACK_LABEL}</p>
                <p className="font-mono text-sm font-bold text-primary-light">{order.referenceId}</p>
              </div>

              {/* Timestamp */}
              <div className="bg-surface-elevated rounded-xl border border-border px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">{POD.CONF_TIME_LABEL}</p>
                <p className="text-sm font-semibold text-text-primary">{order.timestamp}</p>
              </div>

              {/* Photo preview — real if taken, placeholder if skipped */}
              <div
                className="relative rounded-xl overflow-hidden border border-border"
                style={{ aspectRatio: '4/3', backgroundColor: '#D1D5DB' }}
              >
                {photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoUrl} alt="Proof of delivery" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="w-14 h-14 text-white/40" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2 bg-black/50 backdrop-blur-sm">
                  <span className="text-[10px] font-mono text-white/80">{order.photoRef}</span>
                  <CheckCircle2 className="w-4 h-4 text-success" />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href={`/driver/orders/${id}`}
                  className="flex-1 h-11 rounded-xl border border-border text-text-secondary text-sm font-medium hover:bg-surface-elevated transition-colors flex items-center justify-center"
                >
                  {POD.VIEW_DETAILS}
                </Link>
                <Link
                  href="/driver/orders"
                  className="flex-1 h-11 rounded-xl bg-primary-light hover:bg-primary-hover text-white text-sm font-semibold transition-colors flex items-center justify-center"
                >
                  {POD.BACK_TO_QUEUE}
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Mobile bottom bar (photo step only) ── */}
      {step === 'photo' && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border h-16">
          <div className="flex h-full">
            <button
              onClick={() => photoUrl && setStep('signature')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${photoUrl ? 'text-success' : 'text-text-muted'}`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-[10px] font-semibold tracking-wide uppercase">{POD.COMPLETE_NAV}</span>
            </button>
            <div className="w-px bg-border self-stretch my-3" />
            <button
              onClick={() => setShowFailModal(true)}
              className="flex-1 flex flex-col items-center justify-center gap-1 text-error"
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="text-[10px] font-semibold tracking-wide uppercase">{POD.REPORT_NAV}</span>
            </button>
          </div>
        </nav>
      )}

      <ReportFailedModal
        isOpen={showFailModal}
        onClose={() => setShowFailModal(false)}
        orderId={order.referenceId}
      />
    </>
  );
}
