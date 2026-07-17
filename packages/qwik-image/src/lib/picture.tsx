import {
  component$,
  useContext,
  useSignal,
  useTask$,
} from '@builder.io/qwik';
import {
  getSizes,
  getSrcSet,
  Image,
  ImageContext,
  type ImageProps,
} from './image';

/**
 * @alpha
 */
export type PictureSource = {
  src: string;
  media: string;
  type?: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: number;
};

/**
 * @alpha
 */
export interface PictureProps extends ImageProps {
  sources?: PictureSource[];
}

type ComputedPictureSource = {
  media: string;
  type?: string;
  srcset: string;
  sizes?: string;
};

/**
 * @alpha
 */
export const Picture = component$<PictureProps>((props) => {
  const computedSourcesSig = useSignal<ComputedPictureSource[]>([]);
  const state = useContext(ImageContext);
  const { sources, resolutions, imageTransformer$, ...imageAttributes } = {
    ...state,
    ...props,
  };
  const imageAttributesWithoutChildren = {
    ...imageAttributes,
    children: undefined,
  };

  useTask$(async ({ track }) => {
    const sources = track(() => props.sources) ?? [];
    const width = track(() => props.width);
    const height = track(() => props.height);
    const aspectRatio = track(() => props.aspectRatio);
    const layout = track(() => props.layout);

    computedSourcesSig.value = await Promise.all(
      sources.map(async (source) => {
        // `PictureSource.width`/`height` accept any `string` (per-source
        // override ergonomics), but `getSrcSet`/`getSizes` type their
        // `width`/`height` params as `ImageProps['width']`/`['height']`
        // (Qwik's `Numberish` JSX attribute type, i.e. `number |
        // \`${number}\``). `getSrcSet` parses numeric strings via `parseInt`
        // and `getSizes` interpolates the value directly into the template
        // string, so this cast is behavior-preserving for both.
        const effectiveWidth = (source.width ?? width) as ImageProps['width'];
        const effectiveHeight = (source.height ?? height) as ImageProps['height'];
        const effectiveAspectRatio = source.aspectRatio ?? aspectRatio;

        const srcset = await getSrcSet({
          src: source.src,
          width: effectiveWidth,
          height: effectiveHeight,
          aspectRatio: effectiveAspectRatio,
          layout,
          resolutions,
          imageTransformer$,
        });

        return {
          media: source.media,
          type: source.type,
          srcset,
          sizes: getSizes({ width: effectiveWidth, layout }),
        };
      })
    );
  });

  return (
    <picture>
      {computedSourcesSig.value.map((source) => (
        <source
          key={source.media}
          media={source.media}
          type={source.type}
          srcset={source.srcset}
          sizes={source.sizes}
        />
      ))}
      <Image {...imageAttributesWithoutChildren} />
    </picture>
  );
});
