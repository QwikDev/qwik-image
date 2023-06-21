import { component$, useSignal } from '@builder.io/qwik';
import { providers, selectedProvider } from '../providers';
import { Image } from 'qwik-image';

export default component$(() => {
  const ref = useSignal<HTMLImageElement>();

  return (
    <>
      Selected Provider<h1>{selectedProvider}</h1>
      <Image
        ref={ref}
        onLoad$={() => {
          console.log('loaded');
        }}
        width={400}
        height={400}
        style={{ border: '2px solid red' }}
        placeholder="#e6e6e6"
        layout="constrained"
        src={providers[selectedProvider].src}
      />
    </>
  );
});
