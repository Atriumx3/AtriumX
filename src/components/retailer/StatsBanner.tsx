export default function StatsBanner() {
  const stats = [
    { value: '500+', label: 'Students in residence' },
    { value: '95%', label: 'Access the platform from their phone' },
    { value: '7 days', label: 'Average listing viewing window' },
  ];

  return (
    <div className="bg-teal-primary py-12 px-6">
      <div className="max-w-md mx-auto flex flex-col gap-8">
        {stats.map(stat => (
          <div key={stat.label} className="text-center">
            <p className="text-gold font-bold text-4xl">{stat.value}</p>
            <p className="text-cream text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
      <p className="text-cream-muted text-xs text-center mt-8 max-w-md mx-auto">
        Figures are estimated for your residence cluster.
      </p>
    </div>
  );
}
