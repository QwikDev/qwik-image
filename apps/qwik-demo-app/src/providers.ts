import { ImageTransformerProps } from 'qwik-image';

export const selectedProvider: keyof typeof providers = 'builder.io';

export const providers: Record<
  string,
  {
    src: string;
    transformer: ({ src, width, height }: ImageTransformerProps) => string;
  }
> = {
  'builder.io': {
    src: 'image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F869bfbaec9c64415ae68235d9b7b1425',
    transformer: ({ src, width, height }) => {
      return `https://cdn.builder.io/api/v1/${src}?height=${height}&width=${width}&format=webp&fit=fill`;
    },
  },
  cloudflare: {
    src: 'https://thumbs.dreamstime.com/b/pizza-rustic-italian-mozzarella-cheese-basil-leaves-35669930.jpg',
    transformer: ({ src, width, height }) => {
      return `https://that-test.site/cdn-cgi/image/w=${width},h=${height},q=100,fit=contain/${src}`;
    },
  },
};
