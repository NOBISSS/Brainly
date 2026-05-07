export function CloudBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-purple-50" />

      {/* Cloud SVG positioned at 70% from top */}
      <svg
        className="absolute w-full h-auto"
        style={{ top: '70%' }}
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#DDD6FE" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Cloud upper border */}
        <path
          fill="url(#cloudGradient)"
          fillOpacity="1"
          d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,144C672,139,768,149,864,154.7C960,160,1056,160,1152,154.7C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>

      {/* Additional cloud details with soft shadows */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-purple-100/30 to-transparent" />
    </div>
  )
}
