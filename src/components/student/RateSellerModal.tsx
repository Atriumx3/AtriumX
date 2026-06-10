import { X } from 'lucide-react';
import { useState } from 'react';
import StarRating from '../common/StarRating';
import { submitRating } from '../../services/dataService';
import { useApp } from '../../context/AppContext';

interface RateSellerModalProps {
  sellerId: string;
  listingId: string;
  raterId: string;
  sellerName: string;
  onSkip: () => void;
}

export default function RateSellerModal({ sellerId, listingId, raterId, sellerName, onSkip }: RateSellerModalProps) {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useApp();

  const handleSubmit = async () => {
    if (stars === 0 || submitted) return;
    const { error } = await submitRating(sellerId, raterId, listingId, stars, comment);
    if (!error) {
      setSubmitted(true);
      showToast('Rating submitted. Thank you.', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center" onClick={onSkip}>
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div
        className="relative bg-slate-card border border-slate-border rounded-t-2xl p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onSkip} className="absolute top-4 right-4">
          <X size={20} className="text-cream-muted" />
        </button>
        <h3 className="text-cream font-bold text-lg mb-1">How was your experience?</h3>
        <p className="text-cream-muted text-sm mb-4">
          Your rating helps other students make safe decisions.
        </p>
        <StarRating rating={stars} size="md" interactive onRate={setStars} />
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value.slice(0, 150))}
          placeholder="Leave a comment (optional)"
          maxLength={150}
          rows={3}
          className="w-full mt-4 bg-slate-deep border border-slate-border rounded-xl px-4 py-3 text-cream text-sm placeholder:text-cream-muted focus:outline-none focus:border-teal-light resize-none"
        />
        <button
          onClick={handleSubmit}
          disabled={stars === 0 || submitted}
          className={`bg-ember text-white rounded-xl py-3 px-6 font-bold text-base w-full mt-4 ${
            stars === 0 || submitted ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          Submit Rating
        </button>
        <button onClick={onSkip} className="text-teal-light underline text-sm w-full text-center mt-3 block">
          Skip
        </button>
      </div>
    </div>
  );
}
