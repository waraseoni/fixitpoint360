"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Link2, Check } from "lucide-react";

export function QrCode({
  url,
  size = 148,
  showActions = true,
  title,
  caption,
}: {
  url?: string;
  size?: number;
  showActions?: boolean;
  title?: string;
  caption?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const target = url || origin;
  const ready = target.length > 0;

  const download = () => {
    const canvas = boxRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(target);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {title && <p className="text-sm font-semibold text-slate-900">{title}</p>}
      <div
        ref={boxRef}
        className="inline-flex rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
      >
        {ready && <QRCodeCanvas value={target} size={size} level="M" marginSize={1} />}
      </div>
      {caption && <p className="text-center text-xs text-slate-500">{caption}</p>}
      {showActions && (
        <div className="flex items-center gap-2">
          <button
            onClick={download}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700"
          >
            <Download className="h-3.5 w-3.5" /> PNG
          </button>
          <button
            onClick={copyUrl}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Link2 className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied" : "Copy Link"}
          </button>
        </div>
      )}
    </div>
  );
}