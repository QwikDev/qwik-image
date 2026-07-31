import { QwikCityMockProvider } from '@qwik.dev/router';
import { createDOM } from '@qwik.dev/core/testing';
import { expect, test } from 'vitest';
import {
  Image,
  ImageProps,
  ImageTransformerProps,
  useImageProvider,
} from 'qwik-image';
import { $, Slot, component$, useStore } from '@qwik.dev/core';
import { providers, selectedProvider } from '../providers';

const TransformerProvider = component$(() => {
  const imageTransformer$ = $((props: ImageTransformerProps): string => {
    return providers[selectedProvider].transformer(props);
  });

  useImageProvider({
    imageTransformer$,
  });

  return <Slot />;
});

const SRC =
  'image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F869bfbaec9c64415ae68235d9b7b1425';

test(`should render a constrained img`, async () => {
  const { screen, render } = await createDOM();
  await render(
    <QwikCityMockProvider>
      <TransformerProvider>
        <Image width={400} height={400} layout="constrained" src={SRC} />
      </TransformerProvider>
    </QwikCityMockProvider>
  );

  validateImg(screen.querySelector('img'), {
    src: SRC,
    layout: 'constrained',
    width: 400,
    height: 400,
    srcSizes: [
      {
        height: 400,
        width: 400,
        breakpoint: 400,
      },
      {
        height: 400,
        width: 640,
        breakpoint: 640,
      },
      {
        height: 400,
        width: 800,
        breakpoint: 800,
      },
    ],
  });
});

test(`should render a constrained rectangular img`, async () => {
  const { screen, render } = await createDOM();
  await render(
    <QwikCityMockProvider>
      <TransformerProvider>
        <Image width={300} height={200} layout="constrained" src={SRC} />
      </TransformerProvider>
    </QwikCityMockProvider>
  );

  validateImg(screen.querySelector('img'), {
    width: 300,
    height: 200,
    src: SRC,
    layout: 'constrained',
    srcSizes: [
      {
        height: 200,
        width: 300,
        breakpoint: 300,
      },
      {
        height: 200,
        width: 600,
        breakpoint: 600,
      },
    ],
  });
});

test(`should render a fullWidth img`, async () => {
  const { screen, render } = await createDOM();
  await render(
    <QwikCityMockProvider>
      <TransformerProvider>
        <Image width={400} height={400} layout="fullWidth" src={SRC} />
      </TransformerProvider>
    </QwikCityMockProvider>
  );

  validateImg(screen.querySelector('img'), {
    src: SRC,
    layout: 'fullWidth',
    width: 400,
    height: 400,
    srcSizes: [
      {
        height: 400,
        width: 1280,
        breakpoint: 1280,
      },
      {
        height: 400,
        width: 1920,
        breakpoint: 1920,
      },
      {
        height: 400,
        width: 3840,
        breakpoint: 3840,
      },
      {
        height: 400,
        width: 640,
        breakpoint: 640,
      },
      {
        height: 400,
        width: 960,
        breakpoint: 960,
      },
    ],
  });
});

test(`should render a fullWidth rectangular img`, async () => {
  const { screen, render } = await createDOM();
  await render(
    <QwikCityMockProvider>
      <TransformerProvider>
        <Image width={300} height={200} layout="fullWidth" src={SRC} />
      </TransformerProvider>
    </QwikCityMockProvider>
  );

  validateImg(screen.querySelector('img'), {
    width: 300,
    height: 200,
    src: SRC,
    layout: 'fullWidth',
    srcSizes: [
      {
        height: 200,
        width: 1280,
        breakpoint: 1280,
      },
      {
        height: 200,
        width: 1920,
        breakpoint: 1920,
      },
      {
        height: 200,
        width: 3840,
        breakpoint: 3840,
      },
      {
        height: 200,
        width: 640,
        breakpoint: 640,
      },
      {
        height: 200,
        width: 960,
        breakpoint: 960,
      },
    ],
  });
});

test(`should render a fixed img`, async () => {
  const { screen, render } = await createDOM();
  await render(
    <QwikCityMockProvider>
      <TransformerProvider>
        <Image width={600} height={500} layout="fixed" src={SRC} />
      </TransformerProvider>
    </QwikCityMockProvider>
  );

  validateImg(screen.querySelector('img'), {
    src: SRC,
    layout: 'fixed',
    width: 600,
    height: 500,
    srcSizes: [
      {
        height: 500,
        width: 1200,
        breakpoint: 1200,
      },
      {
        height: 500,
        width: 600,
        breakpoint: 600,
      },
    ],
  });
});

const DynamicImage = component$(
  (props: { before: ImageProps; after: ImageProps }) => {
    const state = useStore({ ...props.before });

    return (
      <>
        <Image
          width={state.width}
          height={state.height}
          layout={state.layout}
          src={state.src}
        />
        <button
          onClick$={() => {
            Object.assign(state, props.after);
          }}
        ></button>
      </>
    );
  }
);

test(`should update img when props change`, async () => {
  const { screen, render, userEvent } = await createDOM();
  await render(
    <QwikCityMockProvider>
      <TransformerProvider>
        <DynamicImage
          before={{
            width: 400,
            height: 400,
            layout: 'constrained',
            src: SRC,
          }}
          after={{
            width: 300,
            height: 200,
            layout: 'fullWidth',
            src: SRC + 'something',
          }}
        />
      </TransformerProvider>
    </QwikCityMockProvider>
  );

  validateImg(screen.querySelector('img'), {
    src: SRC,
    layout: 'constrained',
    width: 400,
    height: 400,
    srcSizes: [
      {
        height: 400,
        width: 400,
        breakpoint: 400,
      },
      {
        height: 400,
        width: 640,
        breakpoint: 640,
      },
      {
        height: 400,
        width: 800,
        breakpoint: 800,
      },
    ],
  });

  await userEvent('button', 'click');

  validateImg(screen.querySelector('img'), {
    src: SRC + 'something',
    layout: 'fullWidth',
    width: 300,
    height: 200,
    srcSizes: [
      {
        height: 200,
        width: 1280,
        breakpoint: 1280,
      },
      {
        height: 200,
        width: 1920,
        breakpoint: 1920,
      },
      {
        height: 200,
        width: 3840,
        breakpoint: 3840,
      },
      {
        height: 200,
        width: 640,
        breakpoint: 640,
      },
      {
        height: 200,
        width: 960,
        breakpoint: 960,
      },
    ],
  });
});

test(`should lazy load with async decoding by default`, async () => {
  const { screen, render } = await createDOM();
  await render(
    <QwikCityMockProvider>
      <TransformerProvider>
        <Image width={400} height={400} layout="constrained" src={SRC} />
      </TransformerProvider>
    </QwikCityMockProvider>
  );

  const img = screen.querySelector('img');
  expect(img?.getAttribute('loading')).toBe('lazy');
  expect(img?.getAttribute('decoding')).toBe('async');
  expect(img?.hasAttribute('fetchpriority')).toBe(false);
});

test(`should eagerly load with high fetch priority when priority is set`, async () => {
  const { screen, render } = await createDOM();
  await render(
    <QwikCityMockProvider>
      <TransformerProvider>
        <Image
          width={400}
          height={400}
          layout="constrained"
          src={SRC}
          priority
        />
      </TransformerProvider>
    </QwikCityMockProvider>
  );

  const img = screen.querySelector('img');
  expect(img?.getAttribute('loading')).toBe('eager');
  expect(img?.getAttribute('fetchpriority')).toBe('high');
  expect(img?.hasAttribute('priority')).toBe(false);
});

test(`should keep explicitly set loading and fetchpriority`, async () => {
  const { screen, render } = await createDOM();
  await render(
    <QwikCityMockProvider>
      <TransformerProvider>
        <Image
          width={400}
          height={400}
          layout="constrained"
          src={SRC}
          loading="eager"
          fetchpriority="low"
        />
      </TransformerProvider>
    </QwikCityMockProvider>
  );

  const img = screen.querySelector('img');
  expect(img?.getAttribute('loading')).toBe('eager');
  expect(img?.getAttribute('fetchpriority')).toBe('low');
});

function validateImg(
  img: HTMLImageElement | null,
  props: {
    width: number;
    height: number;
    srcSizes: {
      height: number;
      width: number;
      breakpoint: number;
    }[];
    src: string;
    layout: 'constrained' | 'fixed' | 'fullWidth';
  }
) {
  expect(img).toBeTruthy();
  expect(img?.outerHTML).toContain(`src="${props.src}"`);

  const expectedSizes = props.srcSizes
    .map(
      ({ width, height, breakpoint }) =>
        `https://cdn.builder.io/api/v1/${props.src}?height=${height}&width=${width}&format=webp&fit=fill ${breakpoint}w`
    )
    .join(',\n');
  expect(img?.srcset).toEqual(expectedSizes);

  if (props.layout === 'constrained') {
    expect(img?.outerHTML).toContain(
      `sizes="(min-width: ${props.width}px) ${props.width}px, 100vw"`
    );
  } else if (props.layout === 'fixed') {
    expect(img?.outerHTML).toContain(`width="${props.width}"`);
    expect(img?.outerHTML).toContain(`height="${props.height}"`);
    expect(img?.outerHTML).toContain(`sizes="${props.width}px"`);
  } else {
    expect(img?.outerHTML).toContain(`sizes="100vw"`);
  }
}
