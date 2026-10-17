"""Compare paired browser screenshots; requires Pillow."""
import json
from pathlib import Path
from PIL import Image, ImageChops

root = Path('artifacts/parity')
results = []
captures = json.loads((root / 'captures.json').read_text())
assert captures, 'No captures recorded by the browser checks'
for capture in captures:
    baseline = root / f'baseline-{capture}.png'
    candidate = root / baseline.name.replace('baseline-', 'astro-', 1)
    original = Image.open(baseline).convert('RGB')
    migrated = Image.open(candidate).convert('RGB')
    if original.size != migrated.size:
        results.append({'capture': baseline.stem.removeprefix('baseline-'), 'same_size': False, 'baseline_size': original.size, 'astro_size': migrated.size})
        continue
    difference = ImageChops.difference(original, migrated)
    channels = difference.split()
    mask = ImageChops.lighter(ImageChops.lighter(channels[0], channels[1]), channels[2])
    changed = original.width * original.height - mask.histogram()[0]
    maximum = max(channel.getextrema()[1] for channel in channels)
    # Allow one 8-bit colour level for GPU/compositor gradient rounding.
    significant = sum(mask.histogram()[2:])
    results.append({'capture': baseline.stem.removeprefix('baseline-'), 'same_size': True, 'changed_pixels': changed, 'pixels_over_one_level': significant, 'maximum_channel_difference': maximum, 'total_pixels': original.width * original.height})
    if changed:
        difference.save(root / baseline.name.replace('baseline-', 'diff-', 1))
(root / 'visual-results.json').write_text(json.dumps(results, indent=2))
print(f"Compared {len(results)} screenshot pairs; "
      f"{sum(result.get('changed_pixels') == 0 for result in results)} are exact; "
      f"{sum(not result['same_size'] or result.get('pixels_over_one_level', 0) > 0 for result in results)} exceed one colour level.")
for result in results:
    if not result['same_size'] or result.get('pixels_over_one_level', 0):
        print(json.dumps(result))
if any(not result['same_size'] or result['pixels_over_one_level'] for result in results):
    raise SystemExit(1)
