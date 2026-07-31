import { component$, useStylesScoped$ } from '@qwik.dev/core';
import { providers, selectedProvider } from '../providers';
import { Image, Picture } from 'qwik-image';
import styles from './index.css?inline';

export default component$(() => {
  const src = providers[selectedProvider].src;

  useStylesScoped$(styles);

  return (
    <>
      Selected Provider<h1>{selectedProvider}</h1>
      <div class="examples">
        <article>
          <h2>Image</h2>
          <Image
            width={400}
            height={400}
            style={{ border: '2px solid red' }}
            placeholder="#e6e6e6"
            layout="constrained"
            src={src}
            alt="Qwik Image example"
            priority
          />
        </article>

        <article>
          <h2>Picture</h2>
          <Picture
            width={400}
            height={400}
            style={{ border: '2px solid var(--qwik-dark-purple)' }}
            placeholder="#e6e6e6"
            layout="constrained"
            src={src}
            alt="Qwik Picture example"
            sources={[
              {
                src,
                media: '(max-width: 600px)',
                width: 600,
                height: 600,
              },
              {
                src,
                media: '(min-width: 601px)',
                width: 400,
                height: 400,
              },
            ]}
          />
        </article>
      </div>
    </>
  );
});
