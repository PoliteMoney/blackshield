export function RadarMap() {
  return (
    <div className="radar-map-container">
      <svg
        viewBox="0 0 1024 550"
        preserveAspectRatio="xMidYMid slice"
        className="global-radar-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="radar-sweep" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </radialGradient>
        </defs>

        <image
          href="/images/mapamundi-mundo.png"
          x="179" y="96"
          width="666" height="358"
          className="world-map-layer"
        />

        <g transform="translate(303, 265) scale(0.65)">
          <circle cx="0" cy="0" r="10" fill="none" stroke="#1D4E89" strokeWidth="2" className="mexico-ping" />
        </g>

        <g transform="translate(512, 275)">
          <circle cx="0" cy="0" r="230" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.3" />
          <circle cx="0" cy="0" r="180" fill="none" stroke="#d4af37" strokeWidth="1.5" opacity="0.5" />
          <circle cx="0" cy="0" r="130" fill="none" stroke="#666666" strokeWidth="2" opacity="0.8" />

          <g className="radar-spin">
            <path d="M 0 0 L 0 -230 A 230 230 0 0 1 230 0 Z" fill="url(#radar-sweep)" opacity="0.8" />

            <line x1="-250" y1="0" x2="250" y2="0" stroke="#d4af37" strokeWidth="1" opacity="0.6" />
            <line x1="0" y1="-250" x2="0" y2="250" stroke="#d4af37" strokeWidth="1" opacity="0.6" />

            <circle cx="0" cy="-230" r="6" fill="#d4af37" filter="url(#glow)" />
            <circle cx="230" cy="0" r="6" fill="#d4af37" filter="url(#glow)" />
            <circle cx="0" cy="230" r="6" fill="#d4af37" filter="url(#glow)" />
            <circle cx="-230" cy="0" r="6" fill="#d4af37" filter="url(#glow)" />

            <circle cx="127" cy="-127" r="4" fill="#d4af37" />
            <circle cx="-127" cy="127" r="4" fill="#d4af37" />
          </g>
        </g>

        <image
          href="/images/blackshield-gold-logo.png"
          x="412" y="145"
          width="200" height="260"
        />
      </svg>
    </div>
  )
}
