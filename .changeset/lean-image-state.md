---
'qwik-image': patch
---

`Image` and `Picture` no longer serialize per-instance resumable state: attributes and `srcset` are computed during render instead of through tasks, signals and computeds (#21).

Also:

- an explicit `sizes` prop is now respected instead of being replaced by the computed one;
- `layout`, `objectFit`, `aspectRatio` and `placeholder` are no longer rendered as `<img>` attributes;
- `srcset` entries are sorted by width numerically.
