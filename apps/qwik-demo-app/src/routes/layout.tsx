import { $, component$, Slot } from '@builder.io/qwik';
import { providers, selectedProvider } from '../providers';

import Header from '../components/header/header';
import { ImageTransformerProps, useImageProvider } from 'qwik-image';

export default component$(() => {
	const imageTransformer$ = $((props: ImageTransformerProps): string => {
		return providers[selectedProvider].transformer(props);
	});

	// Provide your default options
	useImageProvider({
		imageTransformer$,
	});

	return (
		<>
			<main>
				<Header />
				<section>
					<Slot />
				</section>
			</main>
			<footer>
				<a href='https://www.builder.io/' target='_blank'>
					Made with ♡ by Builder.ioß
				</a>
			</footer>
		</>
	);
});
