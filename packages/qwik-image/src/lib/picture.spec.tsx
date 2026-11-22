import { $, Slot, component$ } from '@qwik.dev/core';
import { createDOM } from '@qwik.dev/core/testing';
import { describe, expect, it } from 'vitest';
import { useImageProvider, type ImageTransformerProps } from './image';
import { Picture, type PictureSource } from './picture';

// `Image`/`Picture` read `ImageContext` via `useContext`, which throws if no
// ancestor has called `useImageProvider`/`useContextProvider`. Mirrors the
// `TransformerProvider` wrapper used in
// apps/qwik-demo-app/src/components/image.spec.tsx.
const ImageProviderWrapper = component$(() => {
  useImageProvider({});
  return <Slot />;
});

describe('Picture', () => {
  it('renders a <picture> wrapping a single fallback <img> when sources is omitted', async () => {
    const { screen, render } = await createDOM();
    await render(
      <ImageProviderWrapper>
        <Picture
          layout="fullWidth"
          alt="Banner"
          src="https://example.com/desktop.jpg"
        />
      </ImageProviderWrapper>
    );

    const picture = screen.querySelector('picture');
    expect(picture).not.toBeNull();
    expect(picture?.querySelectorAll('source').length).toBe(0);

    const img = picture?.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('alt')).toBe('Banner');
  });

  it('renders one <source> per entry with the correct media and type', async () => {
    const { screen, render } = await createDOM();
    await render(
      <ImageProviderWrapper>
        <Picture
          layout="fullWidth"
          alt="Banner"
          src="https://example.com/desktop.jpg"
          sources={[
            {
              src: 'https://example.com/mobile.jpg',
              media: '(max-width: 767px)',
              type: 'image/webp',
            },
            {
              src: 'https://example.com/desktop.jpg',
              media: '(min-width: 768px)',
            },
          ]}
        />
      </ImageProviderWrapper>
    );

    const sources = screen.querySelectorAll('source');
    expect(sources.length).toBe(2);
    expect(sources[0].getAttribute('media')).toBe('(max-width: 767px)');
    expect(sources[0].getAttribute('type')).toBe('image/webp');
    expect(sources[1].getAttribute('media')).toBe('(min-width: 768px)');
  });

  it('renders same-media sources with different formats', async () => {
    const { screen, render } = await createDOM();
    await render(
      <ImageProviderWrapper>
        <Picture
          layout="fullWidth"
          alt="Banner"
          src="https://example.com/desktop.jpg"
          sources={[
            {
              src: 'https://example.com/banner.avif',
              media: '(min-width: 768px)',
              type: 'image/avif',
            },
            {
              src: 'https://example.com/banner.webp',
              media: '(min-width: 768px)',
              type: 'image/webp',
            },
          ]}
        />
      </ImageProviderWrapper>
    );

    const sources = screen.querySelectorAll('source');
    expect(sources.length).toBe(2);
    expect(sources[0].getAttribute('type')).toBe('image/avif');
    expect(sources[1].getAttribute('type')).toBe('image/webp');
  });

  it('puts loading and fetchpriority on the fallback <img>, and it is the last child', async () => {
    const { screen, render } = await createDOM();
    await render(
      <ImageProviderWrapper>
        <Picture
          layout="fullWidth"
          alt="Banner"
          loading="eager"
          fetchpriority="high"
          src="https://example.com/desktop.jpg"
          sources={[
            {
              src: 'https://example.com/mobile.jpg',
              media: '(max-width: 767px)',
            },
          ]}
        />
      </ImageProviderWrapper>
    );

    const picture = screen.querySelector('picture')!;
    const img = picture.querySelector('img');
    expect(img?.getAttribute('loading')).toBe('eager');
    expect(img?.getAttribute('fetchpriority')).toBe('high');
    expect(picture.lastElementChild?.tagName.toLowerCase()).toBe('img');
  });

  it('forwards priority to the fallback <img>', async () => {
    const { screen, render } = await createDOM();
    await render(
      <ImageProviderWrapper>
        <Picture
          layout="fullWidth"
          alt="Banner"
          priority
          src="https://example.com/desktop.jpg"
        />
      </ImageProviderWrapper>
    );

    const img = screen.querySelector('picture img');
    expect(img?.getAttribute('loading')).toBe('eager');
    expect(img?.getAttribute('fetchpriority')).toBe('high');
  });

  it('passes each source src through the context imageTransformer$', async () => {
    const transformer$ = $(({ src, width }: ImageTransformerProps): string => {
      return `${src}?w=${width}`;
    });

    const Host = component$((hostProps: { sources: PictureSource[] }) => {
      useImageProvider({ resolutions: [640], imageTransformer$: transformer$ });
      return (
        <Picture
          layout="fullWidth"
          alt="Banner"
          src="https://example.com/desktop.jpg"
          sources={hostProps.sources}
        />
      );
    });

    const { screen, render } = await createDOM();
    await render(
      <Host
        sources={[
          {
            src: 'https://example.com/mobile.jpg',
            media: '(max-width: 767px)',
          },
          {
            src: 'https://example.com/desktop.jpg',
            media: '(min-width: 768px)',
          },
        ]}
      />
    );

    const sources = screen.querySelectorAll('source');
    expect(sources[0].getAttribute('srcset')).toContain('mobile.jpg?w=640');
    expect(sources[1].getAttribute('srcset')).toContain('desktop.jpg?w=640');
  });

  it('uses the per-source width override when building that source srcset', async () => {
    const transformer$ = $(({ src, width }: ImageTransformerProps): string => {
      return `${src}?w=${width}`;
    });

    const Host = component$((hostProps: { sources: PictureSource[] }) => {
      useImageProvider({ imageTransformer$: transformer$ });
      return (
        <Picture
          layout="constrained"
          width={800}
          alt="Banner"
          src="https://example.com/desktop.jpg"
          sources={hostProps.sources}
        />
      );
    });

    const { screen, render } = await createDOM();
    await render(
      <Host
        sources={[
          {
            src: 'https://example.com/mobile.jpg',
            media: '(max-width: 767px)',
            width: 400,
          },
        ]}
      />
    );

    const srcset = screen.querySelector('source')?.getAttribute('srcset') ?? '';
    // constrained breakpoints for width=400 include 400 and its 2x (800), not 1600.
    expect(srcset).toContain('w=400');
    expect(srcset).not.toContain('w=1600');
  });
});
