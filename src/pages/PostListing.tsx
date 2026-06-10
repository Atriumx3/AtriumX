import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createListing } from '../services/dataService';
import { CATEGORIES } from '../services/mock/mockCategories';
import { useApp } from '../context/AppContext';
import ListingImageUpload from '../components/student/ListingImageUpload';

export default function PostListing() {
  const navigate = useNavigate();
  const { currentUser, showToast } = useApp();
  const [imageData, setImageData] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [listingType, setListingType] = useState<'single' | 'ongoing'>('single');
  const [customCategory, setCustomCategory] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isFormValid =
    !!imageData &&
    title.trim().length > 0 &&
    category !== '' &&
    price !== '' &&
    Number(price) > 0 &&
    description.length >= 20;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!imageData) errs.image = 'A photo is required.';
    if (!title.trim()) errs.title = 'Title is required.';
    if (!category) errs.category = 'Select a category.';
    if (category === 'other' && !customCategory.trim()) errs.customCategory = 'Please describe your category.';
    if (!price || Number(price) <= 0) errs.price = 'Enter a positive price.';
    if (description.length < 20) errs.description = 'Minimum 20 characters required.';

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (!currentUser) return;

    await createListing({
      sellerId: currentUser.id,
      title: title.trim(),
      description,
      price: Number(price),
      category,
      imageUrl: imageData ?? '',
      residence: currentUser.residence,
      listingType,
      customCategory: category === 'other' ? customCategory.trim() : '',
      plan: currentUser.plan ?? 'ghost',
    });

    showToast('Listing submitted for review. It will appear in the feed once approved.', 'success');
    navigate('/feed');
  };

  const inputClass = 'bg-slate-card border border-slate-border rounded-xl px-4 py-3 text-cream w-full text-sm placeholder:text-cream-muted focus:outline-none focus:border-teal-light';

  return (
    <div className="min-h-screen bg-slate-deep">
      <div className="sticky top-0 z-50 bg-slate-deep border-b border-slate-border h-14 flex items-center px-4">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="text-cream" size={20} />
        </button>
      </div>

      <div className="px-4 pt-4 pb-28 max-w-md mx-auto">
        <h1 className="text-cream font-bold text-2xl font-serif">Post a Listing</h1>
        <p className="text-cream-muted text-sm mt-1">Fill in all fields. Incomplete listings will not be posted.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
          <div>
            <label className="text-cream text-sm font-medium mb-1 block">Photo</label>
            <ListingImageUpload onImageSelect={setImageData} />
            {errors.image && <p className="text-status-danger text-sm mt-1">{errors.image}</p>}
          </div>

          <div>
            <label htmlFor="title" className="text-cream text-sm font-medium mb-1 block">Title</label>
            <input
              id="title"
              type="text"
              placeholder="What are you selling?"
              value={title}
              onChange={e => setTitle(e.target.value.slice(0, 80))}
              maxLength={80}
              className={inputClass}
            />
            <p className="text-cream-muted text-xs text-right">{title.length}/80</p>
            {errors.title && <p className="text-status-danger text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="category" className="text-cream text-sm font-medium mb-1 block">Category</label>
            <select
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className={inputClass}
            >
              <option value="" disabled>Select...</option>
              {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            {errors.category && <p className="text-status-danger text-sm mt-1">{errors.category}</p>}
          </div>

          {category === 'other' && (
            <div>
              <label htmlFor="customCategory" className="text-cream text-sm font-medium mb-1 block">Please describe your category</label>
              <input
                id="customCategory"
                type="text"
                placeholder="e.g. Hair braiding, Phone repairs, Art prints"
                value={customCategory}
                onChange={e => setCustomCategory(e.target.value.slice(0, 60))}
                maxLength={60}
                className={inputClass}
                required
              />
              {errors.customCategory && <p className="text-status-danger text-sm mt-1">{errors.customCategory}</p>}
            </div>
          )}

          <div>
            <label className="text-cream text-sm font-medium mb-1 block">Listing type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setListingType('single')}
                className={listingType === 'single' ? 'bg-teal-primary text-cream border border-teal-light rounded-full px-4 py-2 text-sm font-medium' : 'bg-slate-card text-cream-muted border border-slate-border rounded-full px-4 py-2 text-sm font-medium'}
              >
                Single item
              </button>
              <button
                type="button"
                onClick={() => setListingType('ongoing')}
                className={listingType === 'ongoing' ? 'bg-teal-primary text-cream border border-teal-light rounded-full px-4 py-2 text-sm font-medium' : 'bg-slate-card text-cream-muted border border-slate-border rounded-full px-4 py-2 text-sm font-medium'}
              >
                Always available
              </button>
            </div>
            <p className="text-cream-muted text-xs mt-1">
              {listingType === 'single' ? 'I have one of this, once sold it closes' : 'I sell this regularly, stays live'}
            </p>
          </div>

          <div>
            <label htmlFor="price" className="text-cream text-sm font-medium mb-1 block">Price</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-cream-muted text-sm">R</span>
              <input
                id="price"
                type="number"
                placeholder="0.00"
                min="1"
                step="0.01"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className={`${inputClass} pl-8`}
              />
            </div>
            <p className="text-cream-muted text-xs mt-1">Set your price in South African Rand.</p>
            {errors.price && <p className="text-status-danger text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label htmlFor="description" className="text-cream text-sm font-medium mb-1 block">Description</label>
            <textarea
              id="description"
              placeholder="Describe your item — condition, size, what's included, pickup location in residence."
              value={description}
              onChange={e => setDescription(e.target.value.slice(0, 300))}
              maxLength={300}
              rows={4}
              className={`${inputClass} resize-none`}
            />
            <div className="flex justify-between mt-1">
              {description.length < 20 && description.length > 0 && (
                <span className="text-status-danger text-xs">Minimum 20 characters required</span>
              )}
              <span className="text-cream-muted text-xs ml-auto">{description.length}/300</span>
            </div>
            {errors.description && <p className="text-status-danger text-sm mt-1">{errors.description}</p>}
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`bg-ember text-white rounded-xl py-3 px-6 font-bold text-base w-full ${
              !isFormValid ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            Post Listing
          </button>
        </form>
      </div>
    </div>
  );
}
