import { component$ } from '@builder.io/qwik';
import { providers, selectedProvider } from '../providers';
import { Image } from 'qwik-image';

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
    </>
  );
});
