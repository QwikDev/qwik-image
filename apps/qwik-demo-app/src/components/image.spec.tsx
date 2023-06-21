import { QwikCityMockProvider } from '@builder.io/qwik-city';
import { createDOM } from '@builder.io/qwik/testing';
import { expect, test } from 'vitest';
import { Image, ImageTransformerProps, useImageProvider } from 'qwik-image';
import { $, Slot, component$ } from '@builder.io/qwik';
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
  expect(img?.width).toEqual(props.width);
  expect(img?.height).toEqual(props.height);
  expect(img?.src).toEqual(`/${props.src}`);

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
    expect(img?.outerHTML).toContain(`sizes="${props.width}px"`);
  } else {
    expect(img?.outerHTML).toContain(`sizes="100vw"`);
  }
}
