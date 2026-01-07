'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useResumeStore } from '@/stores';

interface QRCodeGeneratorProps {
  url: string;
  size?: number;
  includeMargin?: boolean;
}

/**
 * QR Code component for embedding in resume
 */
export function QRCodeGenerator({ url, size = 80, includeMargin = true }: QRCodeGeneratorProps) {
  if (!url) return null;

  return (
    <div className="qr-code-wrapper inline-block">
      <QRCodeSVG
        value={url}
        size={size}
        level="M"
        includeMargin={includeMargin}
        className="qr-code"
      />
    </div>
  );
}

/**
 * QR Code for contact info (LinkedIn, Portfolio, etc.)
 */
export function ContactQRCode({ label, url }: { label: string; url: string }) {
  const currentResume = useResumeStore((state) => state.currentResume);
  const showQR = currentResume?.settings.theme.showQRCodes ?? false;

  if (!showQR || !url) return null;

  return (
    <div className="flex flex-col items-center gap-1 print:break-inside-avoid">
      <QRCodeSVG
        value={url}
        size={60}
        level="M"
        includeMargin={false}
      />
      <span className="text-[8px] text-gray-600">{label}</span>
    </div>
  );
}
