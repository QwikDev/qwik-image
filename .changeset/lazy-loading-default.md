---
'qwik-image': major
---

Images now render `loading="lazy"` by default instead of loading eagerly. Add the new `priority` prop to above-the-fold/LCP images to render `loading="eager"` and `fetchpriority="high"`; explicit `loading`/`fetchpriority` props take precedence.
