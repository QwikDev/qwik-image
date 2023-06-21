import { component$, useSignal } from '@builder.io/qwik';
import { providers, selectedProvider } from '../providers';
import { Image, ImageProps } from 'qwik-image';

const DynamicImage = component$(
  (props: { before: ImageProps; after: ImageProps }) => {
    const width = useSignal(props.before.width);
    const height = useSignal(props.before.height);
    const layout = useSignal(props.before.layout);
    const src = useSignal(props.before.src);

    return (
      <>
        <Image
          width={width.value}
          height={height.value}
          layout={layout.value}
          src={src.value}
        />
        <button
          onClick$={() => {
            width.value = props.after.width;
            height.value = props.after.height;
            layout.value = props.after.layout;
            src.value = props.after.src;
          }}
        >
          trigger
        </button>
      </>
    );
  }
);

export default component$(() => {
  return (
    <>
      Selected Provider<h1>{selectedProvider}</h1>
      <Image
        width={400}
        height={400}
        style={{ border: '2px solid red' }}
        placeholder="#e6e6e6"
        layout="constrained"
        src={providers[selectedProvider].src}
      />
      <DynamicImage
        before={{
          width: 400,
          height: 400,
          layout: 'constrained',
          src: providers[selectedProvider].src,
        }}
        after={{
          width: 300,
          height: 200,
          layout: 'fullWidth',
          src: providers[selectedProvider].src,
        }}
      />
    </>
  );
});
