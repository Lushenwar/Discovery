import type { Project } from '../content/projects';

// ponytail: procedural placeholder tiles until real screenshots exist — an
// accent-tinted gradient + title, obviously generated, never mistaken for a
// real product shot. Swap for /media/thumbs/<slug>.webp (≤512², ≤60KB) later.
const cache = new Map<string, string>();

export function placeholderThumb(project: Project): string {
  if (project.media.thumb) return project.media.thumb;
  const hit = cache.get(project.slug);
  if (hit) return hit;

  const size = 512;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;

  const g = ctx.createLinearGradient(0, 0, size, size);
  g.addColorStop(0, '#141414');
  g.addColorStop(1, project.media.accent + '55');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = project.media.accent + '88';
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, size - 48, size - 48);

  ctx.fillStyle = '#e8e6e1';
  ctx.font = '600 44px "Inter Tight", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(project.title, size / 2, size / 2 - 10);

  ctx.fillStyle = '#e8e6e199';
  ctx.font = '500 20px "Inter Tight", sans-serif';
  ctx.fillText(String(project.year), size / 2, size / 2 + 36);

  const url = c.toDataURL('image/png');
  cache.set(project.slug, url);
  return url;
}
