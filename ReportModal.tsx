import { X } from 'lucide-react';

interface ReportModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

export default function ReportModal({ onConfirm, onClose }: ReportModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div
        className="relative bg-slate-card border border-slate-border rounded-t-2xl p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4">
          <X size={20} className="text-cream-muted" />
        </button>
        <h3 className="text-cream font-bold text-lg mb-2">Report Listing</h3>
        <p className="text-cream-muted text-sm mb-6">
          If this listing is fraudulent, misleading, or violates community rules, it will be reviewed and may be removed.
        </p>
        <button
          onClick={onConfirm}
          className="bg-ember text-white rounded-xl py-3 px-6 font-bold text-base w-full"
        >
          Confirm Report
        </button>
      </div>
    </div>
  );
}
