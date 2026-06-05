'use client';

import { getBannerViewModel } from '@/lib/bannerUtils.mjs';

export default function Banner({ banner }) {
  const viewModel = getBannerViewModel(banner);
  const style = {
    background: viewModel.gradient,
    aspectRatio: viewModel.aspectRatio,
  };
  const className = [
    'banner',
    'animate-in',
    viewModel.image ? 'banner--has-image' : '',
    viewModel.buttonLink ? 'banner--clickable' : '',
  ].filter(Boolean).join(' ');

  function handleClick() {
    if (viewModel.buttonLink) {
      window.open(viewModel.buttonLink, '_self');
    }
  }

  return (
    <div className={className} style={style} onClick={handleClick}>
      {viewModel.image && (
        <>
          <img className="banner__image" src={viewModel.image} alt={viewModel.title || viewModel.subtitle} />
          {viewModel.showImageOverlay && <div className="banner__image-overlay" />}
        </>
      )}

      {viewModel.hasContent && (
        <>
          <div className="banner__decoration" />
          <div className="banner__decoration banner__decoration--sm" />
        </>
      )}

      {viewModel.subtitle && (
        <span className="banner__subtitle">{viewModel.subtitle}</span>
      )}
      {viewModel.title && (
        <h2 className="banner__title">{viewModel.title}</h2>
      )}
      {viewModel.hasButton && (
        <span className="banner__btn">
          {viewModel.buttonText}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
      )}

    </div>
  );
}
