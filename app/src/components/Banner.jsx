'use client';

export default function Banner({ banner }) {
  const style = {
    background: banner.gradient || 'var(--gradient-banner)',
  };

  function handleClick() {
    if (banner.buttonLink) {
      window.open(banner.buttonLink, '_self');
    }
  }

  return (
    <div className="banner animate-in" style={style} onClick={handleClick}>
      <div className="banner__decoration" />
      <div className="banner__decoration banner__decoration--sm" />

      {banner.subtitle && (
        <span className="banner__subtitle">{banner.subtitle}</span>
      )}
      <h2 className="banner__title">{banner.title}</h2>
      {banner.buttonText && (
        <span className="banner__btn">
          {banner.buttonText}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
      )}

      {banner.image && (
        <img
          src={banner.image}
          alt={banner.title}
          style={{
            position: 'absolute',
            right: 16,
            bottom: 16,
            maxHeight: 80,
            maxWidth: 100,
            objectFit: 'contain',
            opacity: 0.9,
          }}
        />
      )}
    </div>
  );
}
