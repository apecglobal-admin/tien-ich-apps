import Banner from '@/components/Banner';
import Section from '@/components/Section';
import { readData } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function Home() {
  const data = readData();
  const banners = data.banners || [];
  const sections = (data.sections || []).sort((a, b) => a.order - b.order);

  // Build page content: interleave banners at their positions
  // position 0 = before section 0, position 1 = after section 0, etc.
  const content = [];

  // Add banners at position 0 (before any section)
  banners
    .filter((b) => b.position === 0)
    .forEach((b) => content.push({ type: 'banner', data: b }));

  sections.forEach((section, index) => {
    content.push({ type: 'section', data: section });

    // Add banners positioned after this section (position = index + 1)
    banners
      .filter((b) => b.position === index + 1)
      .forEach((b) => content.push({ type: 'banner', data: b }));
  });

  // Add banners with position beyond sections
  const maxPos = sections.length;
  banners
    .filter((b) => b.position > maxPos)
    .forEach((b) => content.push({ type: 'banner', data: b }));

  const settings = data.settings || {};
  const containerStyle = settings.backgroundImage 
    ? { backgroundImage: `url(${settings.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }
    : {};

  return (
    <main className="mobile-frame" id="mobile-app" style={containerStyle}>
      {content.map((item, i) =>
        item.type === 'banner' ? (
          <Banner key={item.data.id} banner={item.data} />
        ) : (
          <Section key={item.data.id} section={item.data} />
        )
      )}
    </main>
  );
}
