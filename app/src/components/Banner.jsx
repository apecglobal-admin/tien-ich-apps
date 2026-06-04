'use client';

export default function Banner({ banner }) {
  const style = {
    background: banner.gradient || 'var(--gradient-banner)',
  };
  const className = `banner animate-in${banner.image ? ' banner--has-image' : ''}`;

  function handleClick() {
    if (banner.buttonLink) {
      window.open(banner.buttonLink, '_self');
    }
  }

  return (
    <div className={className} style={style} onClick={handleClick}>
      {banner.image && (
        <>
          <img className="banner__image" src={banner.image} alt={banner.title} />
          <div className="banner__image-overlay" />
        </>
      )}

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

    </div>
  );
}
