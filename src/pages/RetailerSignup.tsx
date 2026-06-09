import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import RetailerNavbar from '../components/retailer/RetailerNavbar';

export default function RetailerSignup() {
  const [searchParams] = useSearchParams();
  const tierParam = searchParams.get('tier') ?? '';

  const tierMap: Record<string, string> = {
    'noticeboard': 'Noticeboard',
    'featured': 'Featured',
    'campus-partner': 'Campus Partner',
  };
  const initialTier = tierMap[tierParam.toLowerCase()] ?? '';

  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [package_, setPackage] = useState(initialTier);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isFormValid =
    businessName.trim() && businessType && contactName.trim() &&
    email.trim() && phone.trim() && package_ && description.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    console.log({ businessName, businessType, contactName, email, phone, package: package_, description });
    setSubmitted(true);
  };

  const inputClass = 'bg-slate-card border border-slate-border rounded-xl px-4 py-3 text-cream w-full text-sm placeholder:text-cream-muted focus:outline-none focus:border-teal-light';

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-deep">
        <RetailerNavbar />
        <div className="max-w-md mx-auto px-4 pt-16 text-center">
          <h1 className="text-cream font-bold text-2xl">Application Received</h1>
          <p className="text-cream-muted text-sm mt-3">
            Application received. We will contact you within 24 hours at {email}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-deep">
      <RetailerNavbar />
      <div className="max-w-md mx-auto px-4 pt-8 pb-16">
        <h1 className="text-cream font-bold text-2xl font-serif">Register Your Business</h1>
        <p className="text-cream-muted text-sm mt-1">
          Once submitted, our team will review your application within 24 hours.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
          <div>
            <label htmlFor="businessName" className="text-cream text-sm font-medium mb-1 block">Business Name</label>
            <input id="businessName" type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Business Name" className={inputClass} required />
          </div>

          <div>
            <label htmlFor="businessType" className="text-cream text-sm font-medium mb-1 block">Business Type</label>
            <select id="businessType" value={businessType} onChange={e => setBusinessType(e.target.value)} className={inputClass}>
              <option value="" disabled>Select...</option>
              <option value="food">Food & Beverage</option>
              <option value="retail">Retail Shop</option>
              <option value="service">Service Provider</option>
              <option value="print">Print & Stationery</option>
              <option value="transport">Transport</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="contactName" className="text-cream text-sm font-medium mb-1 block">Contact Person Name</label>
            <input id="contactName" type="text" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Contact Person Name" className={inputClass} required />
          </div>

          <div>
            <label htmlFor="email" className="text-cream text-sm font-medium mb-1 block">Email Address</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" className={inputClass} required />
          </div>

          <div>
            <label htmlFor="phone" className="text-cream text-sm font-medium mb-1 block">Phone Number</label>
            <input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+27 82 123 4567" className={inputClass} required />
          </div>

          <div>
            <label htmlFor="package" className="text-cream text-sm font-medium mb-1 block">Selected Package</label>
            <select id="package" value={package_} onChange={e => setPackage(e.target.value)} className={inputClass}>
              <option value="" disabled>Select...</option>
              <option value="Noticeboard">Noticeboard (R150/week)</option>
              <option value="Featured">Featured (R350/week)</option>
              <option value="Campus Partner">Campus Partner (R800/month)</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="text-cream text-sm font-medium mb-1 block">Brief description of your business</label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value.slice(0, 200))}
              maxLength={200}
              rows={3}
              placeholder="Describe your business briefly..."
              className={`${inputClass} resize-none`}
              required
            />
            <p className="text-cream-muted text-xs text-right">{description.length}/200</p>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`bg-ember text-white rounded-xl py-3 px-6 font-bold text-base w-full ${
              !isFormValid ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}
