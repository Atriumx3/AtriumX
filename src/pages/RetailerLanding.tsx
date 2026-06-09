import RetailerNavbar from '../components/retailer/RetailerNavbar';
import PricingCard from '../components/retailer/PricingCard';

export default function RetailerLanding() {
  return (
    <div className="min-h-screen bg-slate-deep">
      <RetailerNavbar />

      {/* Hero */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 bg-slate-deep py-20">
        <p className="text-teal-light text-xs font-bold tracking-widest uppercase">
          JOHANNESBURG, SOUTH AFRICA
        </p>
        <h1 className="text-cream text-4xl leading-tight font-serif mt-4 max-w-md">
          Your business, inside the residence.
        </h1>
        <p className="text-cream-muted text-base max-w-sm mx-auto mt-4">
          Campus Noticeboard connects students with what they need, right where they live. Get your business in front of them.
        </p>
        <div className="flex gap-4 mt-8">
          <a
            href="#pricing"
            className="bg-ember text-white rounded-xl py-3 px-6 font-bold text-base"
          >
            See Pricing
          </a>
          <a
            href="#stats"
            className="bg-transparent border border-slate-border text-cream rounded-xl py-3 px-6 font-bold text-base"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Stats Banner */}
      <section id="stats" className="bg-teal-primary py-12 px-6">
        <div className="max-w-md mx-auto flex flex-col gap-8">
          <div className="text-center">
            <p className="text-gold font-bold text-4xl">500+</p>
            <p className="text-cream text-sm">Students in residence</p>
          </div>
          <div className="text-center">
            <p className="text-gold font-bold text-4xl">95%</p>
            <p className="text-cream text-sm">Browse from their phone</p>
          </div>
          <div className="text-center">
            <p className="text-gold font-bold text-4xl">7 days</p>
            <p className="text-cream text-sm">Average listing lifespan</p>
          </div>
        </div>
        <p className="text-cream-muted text-xs text-center mt-8 max-w-md mx-auto">
          Figures are estimated. Updated as the platform grows.
        </p>
      </section>

      {/* How It Works */}
      <section className="bg-slate-deep px-6 py-16">
        <h2 className="text-cream text-2xl font-bold text-center mb-8">How your listing works</h2>
        <div className="max-w-md mx-auto space-y-4">
          <div className="bg-slate-card border border-slate-border rounded-2xl p-5">
            <span className="text-gold font-bold text-2xl">1</span>
            <h3 className="text-cream font-bold text-base mt-1">Register your business</h3>
            <p className="text-cream-muted text-sm mt-1">Fill in your business details and choose an advertising package.</p>
          </div>
          <div className="bg-slate-card border border-slate-border rounded-2xl p-5">
            <span className="text-gold font-bold text-2xl">2</span>
            <h3 className="text-cream font-bold text-base mt-1">Your listing goes live</h3>
            <p className="text-cream-muted text-sm mt-1">Students browsing the platform see your business in the sponsored section at the top of the feed.</p>
          </div>
          <div className="bg-slate-card border border-slate-border rounded-2xl p-5">
            <span className="text-gold font-bold text-2xl">3</span>
            <h3 className="text-cream font-bold text-base mt-1">Students come to you</h3>
            <p className="text-cream-muted text-sm mt-1">They tap your listing and reach your contact page, your store, or your WhatsApp Business line.</p>
          </div>
        </div>
      </section>

      {/* Business Pricing */}
      <section id="pricing" className="bg-teal-primary px-6 py-16">
        <h2 className="text-cream text-2xl font-bold text-center">Simple, transparent pricing</h2>
        <p className="text-cream-muted text-sm text-center mb-8">No contracts. No surprises. Pay per listing period.</p>
        <div className="max-w-md mx-auto">
          <PricingCard
            tier="Resident"
            price="R 0"
            period="/ month"
            features={[
              '1 active listing at a time',
              'Listing expires after 3 days',
              'Standard feed placement',
              'In-app messaging',
            ]}
          />
          <PricingCard
            tier="Noticeboard"
            price="R 150"
            period="/ week"
            features={[
              '1 standard listing in the student feed',
              'Listed in your category',
              'Active for 7 days',
              'View count analytics',
            ]}
          />
          <PricingCard
            tier="Featured"
            price="R 350"
            period="/ week"
            isHighlighted
            features={[
              '1 listing pinned to top of your category',
              'Gold Sponsored badge',
              'Active for 7 days',
              'Full analytics dashboard',
              'Priority support',
            ]}
          />
          <PricingCard
            tier="Campus Partner"
            price="R 800"
            period="/ month"
            features={[
              'Permanent listing in the Businesses section',
              'Featured in weekly student digest',
              'Category sponsorship rights',
              'Monthly analytics report',
              'Logo on the welcome screen',
            ]}
          />
        </div>
        <p className="text-cream-muted text-xs text-center mt-4 max-w-md mx-auto">
          Payment is handled offline for now. Our team will contact you within 24 hours of your application to confirm your package and payment details.
        </p>
      </section>

      {/* Contact */}
      <section className="bg-slate-deep px-6 py-12 text-center">
        <h2 className="text-cream text-xl font-bold">Questions before signing up?</h2>
        <p className="text-cream-muted text-sm mt-2">
          We work with businesses that genuinely serve students. Reach out directly.
        </p>
        <p className="text-gold font-bold mt-4">hello@campusnoticeboard.co.za</p>
      </section>
    </div>
  );
}
