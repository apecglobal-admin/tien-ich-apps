export const DEFAULT_BANNER_ASPECT_RATIO = '2 / 1';

export const BANNER_ASPECT_RATIO_OPTIONS = [
  { value: '2 / 1', label: '2:1' },
  { value: '2 / 0.5', label: '2:0.5' },
];

const SUPPORTED_ASPECT_RATIOS = new Map([
  ['2 / 1', '2 / 1'],
  ['2:1', '2 / 1'],
  ['2 / 0.5', '2 / 0.5'],
  ['2:0.5', '2 / 0.5'],
]);

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function normalizeBannerAspectRatio(value) {
  return SUPPORTED_ASPECT_RATIOS.get(cleanText(value)) || DEFAULT_BANNER_ASPECT_RATIO;
}

export function getBannerViewModel(banner = {}) {
  const title = cleanText(banner.title);
  const subtitle = cleanText(banner.subtitle);
  const buttonText = cleanText(banner.buttonText);
  const buttonLink = cleanText(banner.buttonLink);
  const image = cleanText(banner.image);
  const hasContent = Boolean(title || subtitle || buttonText);

  return {
    ...banner,
    title,
    subtitle,
    buttonText,
    buttonLink,
    image,
    gradient: cleanText(banner.gradient) || 'var(--gradient-banner)',
    aspectRatio: normalizeBannerAspectRatio(banner.aspectRatio),
    hasButton: Boolean(buttonText),
    hasContent,
    showImageOverlay: Boolean(image && hasContent),
  };
}
