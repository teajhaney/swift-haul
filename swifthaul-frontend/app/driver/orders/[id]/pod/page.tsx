'use client';

import { use, useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  X,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { DriverTopbar } from '@/components/driver/driver-topbar';
import { ReportFailedModal } from '@/components/driver/report-failed-modal';
import { POD } from '@/constants/pod';
import type { PodStep } from '@/types/pod';
import { useOrder } from '@/hooks/orders/use-order';
import { useUpdateStatus } from '@/hooks/orders/use-update-status';
import { useUploadPod } from '@/hooks/orders/use-upload-pod';

function StepDots({ current }: { current: 0 | 1 | 2 }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-5">
      {([0, 1, 2] as const).map(i => (
        <span
          key={i}
          className={`rounded-full transition-all ${
            i === current
              ? 'w-5 h-2 bg-primary-light'
              : 'w-2 h-2 bg-border-strong'
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
  const { data: order, isLoading } = useOrder(id);
  const updateStatus = useUpdateStatus();
  const uploadPod = useUploadPod();

  const [step, setStep] = useState<PodStep>('photo');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [showFailModal, setShowFailModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (error) {
      console.error('Camera access denied or failed', error);
      toast.error('Unable to access camera. Please check permissions.');
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }

  function capturePhoto() {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], 'pod.jpg', { type: 'image/jpeg' });
            if (photoUrl) URL.revokeObjectURL(photoUrl);
            setPhotoFile(file);
            setPhotoUrl(URL.createObjectURL(file));
            setStep('review');
            stopCamera();
          }
        },
        'image/jpeg',
        0.8
      );
    }
  }

  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraActive]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoFile(file);
    setPhotoUrl(URL.createObjectURL(file));
    setStep('review');
    e.target.value = '';
  }

  function retakePhoto() {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoFile(null);
    setPhotoUrl(null);
    setStep('photo');
    setTimeout(() => {
      startCamera();
    }, 100);
  }

  async function confirmDelivered() {
    if (!order || !photoFile) {
      toast.error('Please capture or upload a delivery photo.');
      return;
    }
    try {
      setIsSubmitting(true);
      // Use the uploadPod hook
      await uploadPod.mutateAsync({
        referenceId: id,
        photoFile,
        signedBy: order.recipientName,
      });

      await updateStatus.mutateAsync({ referenceId: id, status: 'DELIVERED' });
      setStep('confirmed');
      toast.success('Delivery confirmed.');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to complete delivery.';
      toast.error(message);
      // Keep this in console while stabilizing Cloudinary integration.
      // It helps confirm whether failure happens before or after backend POD save.
      console.error('POD submit failed', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || !order) {
    return (
      <>
        <DriverTopbar
          backHref={`/driver/orders/${id}`}
          title={POD.PAGE_TITLE}
        />
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="h-64 rounded-xl bg-surface border border-border shadow-sm animate-pulse" />
        </div>
      </>
    );
  }

  return (
    <>
      <DriverTopbar backHref={`/driver/orders/${id}`} title={POD.PAGE_TITLE} />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture
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

      <div className="py-4 sm:py-10 sm:flex sm:justify-center sm:px-4">
        <div className="w-full sm:max-w-md bg-surface sm:rounded-2xl sm:border sm:border-border sm:shadow-xl overflow-hidden">
          {step === 'photo' && (
            <div className="p-6 pb-24 sm:pb-6 space-y-4">
              <StepDots current={0} />
              <div>
                <h2 className="text-xl font-bold text-text-primary">
                  {POD.PHOTO_TITLE}
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  {POD.PHOTO_SUBTITLE}
                </p>
              </div>

              <div className="flex items-center justify-between bg-surface-elevated rounded-lg px-4 py-2.5 border border-border">
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                  {POD.ORDER_ID_LABEL}{' '}
                  <span className="font-mono text-primary-light text-xs">
                    {order.referenceId}
                  </span>
                </p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700 tracking-wide uppercase">
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>

              {photoUrl ? (
                <div
                  className="relative rounded-xl overflow-hidden border border-border"
                  style={{ aspectRatio: '4/3' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl}
                    alt="Captured delivery photo"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={retakePhoto}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                    aria-label="Retake photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : isCameraActive ? (
                <div
                  className="relative rounded-xl overflow-hidden border-2 border-primary-light bg-black"
                  style={{ aspectRatio: '4/3' }}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded tracking-wide uppercase">
                    {POD.LIVE_VIEW}
                  </div>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border-2 border-border bg-surface-elevated h-52 flex flex-col items-center justify-center p-6 text-center text-text-muted">
                  <Camera className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm font-medium">Camera is inactive</p>
                  <p className="text-xs max-w-[200px] mt-1 opacity-80">{POD.PHOTO_HINT}</p>
                </div>
              )}

              {photoUrl ? (
                <>
                  <button
                    onClick={() => setStep('review')}
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
              ) : isCameraActive ? (
                <>
                  <button
                    onClick={capturePhoto}
                    className="w-full h-12 rounded-xl bg-primary-light hover:bg-primary-hover text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Capture Photo
                  </button>
                  <button
                    onClick={stopCamera}
                    className="w-full h-11 rounded-xl border border-border text-text-secondary text-sm font-medium hover:bg-surface-elevated transition-colors flex items-center justify-center gap-2"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={startCamera}
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
            </div>
          )}

          {step === 'review' && (
            <div className="p-6 space-y-4">
              <StepDots current={1} />

              <div>
                <h2 className="text-xl font-bold text-text-primary">
                  {POD.REVIEW_TITLE}
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  {POD.REVIEW_SUBTITLE}
                </p>
              </div>

              {photoUrl ? (
                <div
                  className="relative rounded-xl overflow-hidden border border-border"
                  style={{ aspectRatio: '4/3' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl}
                    alt="Delivery photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-52 rounded-xl bg-surface-elevated border border-border" />
              )}

              <div className="rounded-xl border border-border bg-surface-elevated p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                    {POD.ORDER_ID_LABEL}{' '}
                    <span className="font-mono text-primary-light text-xs">
                      {order.referenceId}
                    </span>
                  </p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700 tracking-wide uppercase">
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-sm font-semibold text-text-primary">
                  {order.recipientName}
                </p>
                <p className="text-sm text-text-secondary">
                  {order.deliveryAddress}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={retakePhoto}
                  disabled={isSubmitting}
                  className="h-11 px-4 rounded-xl border border-border text-text-secondary text-sm font-medium hover:bg-surface-elevated transition-colors disabled:opacity-60"
                >
                  {POD.BACK_TO_PHOTO}
                </button>
                <button
                  onClick={confirmDelivered}
                  disabled={isSubmitting}
                  className="flex-1 h-11 px-5 rounded-xl bg-success hover:bg-emerald-600 text-white text-sm font-semibold disabled:opacity-60"
                >
                  {isSubmitting ? 'Submitting...' : POD.CONFIRM_DELIVERY}
                </button>
              </div>

              <button
                onClick={() => setShowFailModal(true)}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 text-sm font-semibold text-error hover:opacity-90 disabled:opacity-60"
              >
                <AlertTriangle className="w-4 h-4" />
                {POD.REPORT_NAV}
              </button>
            </div>
          )}

          {step === 'confirmed' && (
            <div className="p-6 space-y-4">
              <StepDots current={2} />
              <div className="flex flex-col items-center text-center py-2">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-9 h-9 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  {POD.CONF_TITLE}
                </h2>
              </div>
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

      {step === 'photo' && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border h-16">
          <div className="flex h-full">
            <button
              onClick={() => photoUrl && setStep('review')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
                photoUrl ? 'text-success' : 'text-text-muted'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-[10px] font-semibold tracking-wide uppercase">
                {POD.COMPLETE_NAV}
              </span>
            </button>
            <div className="w-px bg-border self-stretch my-3" />
            <button
              onClick={() => setShowFailModal(true)}
              className="flex-1 flex flex-col items-center justify-center gap-1 text-error"
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="text-[10px] font-semibold tracking-wide uppercase">
                {POD.REPORT_NAV}
              </span>
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
