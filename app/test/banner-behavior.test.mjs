import assert from 'node:assert/strict';
import test from 'node:test';

import { getBannerViewModel, normalizeBannerAspectRatio } from '../src/lib/bannerUtils.mjs';

test('treats whitespace-only banner content as empty', () => {
  const viewModel = getBannerViewModel({
    title: ' ',
    subtitle: ' ',
    buttonText: ' ',
    image: '/uploads/banner.png',
    aspectRatio: '2 / 0.5',
  });

  assert.equal(viewModel.title, '');
  assert.equal(viewModel.subtitle, '');
  assert.equal(viewModel.buttonText, '');
  assert.equal(viewModel.hasContent, false);
  assert.equal(viewModel.showImageOverlay, false);
  assert.equal(viewModel.aspectRatio, '2 / 0.5');
});

test('shows image overlay only when banner has visible content', () => {
  const withTitle = getBannerViewModel({
    title: 'Promo',
    image: '/uploads/banner.png',
  });

  const imageOnly = getBannerViewModel({
    image: '/uploads/banner.png',
  });

  assert.equal(withTitle.hasContent, true);
  assert.equal(withTitle.showImageOverlay, true);
  assert.equal(imageOnly.hasContent, false);
  assert.equal(imageOnly.showImageOverlay, false);
});

test('normalizes banner aspect ratio to supported CMS choices', () => {
  assert.equal(normalizeBannerAspectRatio('2 / 0.5'), '2 / 0.5');
  assert.equal(normalizeBannerAspectRatio('2:0.5'), '2 / 0.5');
  assert.equal(normalizeBannerAspectRatio('4 / 1'), '2 / 1');
  assert.equal(normalizeBannerAspectRatio(''), '2 / 1');
  assert.equal(normalizeBannerAspectRatio(undefined), '2 / 1');
});
