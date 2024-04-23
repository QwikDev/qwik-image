<p align="center">
<br/>
  <img width="300" src="./packages/qwik-image/assets/qwik-image-logo.png" alt="The goal is a component to support performant images on the web and automatic image optimization.
That will be built as a pluggable component so devs could connect different image loaders to it (like Cloudinary, or builder)">
  <br/>
  <br/>
</p>

<h1 align='center'><a href='https://github.com/BuilderIO/qwik'>Qwik</a> Image Component</h1>

<div align='center'>
  <h3>The goal is a component to support performant images on the web and automatic image optimization.
That will be built as a pluggable component so devs could connect different image loaders to it (like builder.io or Cloudinary)</h3>
  
  <br><br>

  <a href='https://img.shields.io/npm/v/qwik-image?label=npm%20version'>
  <img src='https://img.shields.io/npm/v/qwik-image?label=npm%20version' alt='qwik-image npm'>
  </a>
  <a href='https://opensource.org/licenses/MIT'>
  <img src='https://img.shields.io/badge/License-MIT-green.svg' alt='MIT'>
  </a>
  <a href='#contributors'>
  <img src='https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square' alt='All Contributors'>
  </a>

</div>
<br>

## Showcase ( network Slow 3G 🤯 )

![qwik-image-showcase](./packages/qwik-image/assets/qwik-image-showcase.gif)

## Installation

```
npm install qwik-image
or
yarn install qwik-image
or
pnpm install qwik-image
```

## Usage

### Global Provider (required)

```
const imageTransformer$ = $(({ src, width, height }: ImageTransformerProps): string => {
  return `${src}?w=${width}&h=${height}&format=webp`;
});

// Provide your default options
useImageProvider({
  // you can set this property to overwrite default values [640, 960, 1280, 1920, 3840]
  resolutions: [640],
  // you we can define the source from which to load our image
  imageTransformer$,
});
```

### Image component

```
<Image
  layout="fixed"
  objectFit="cover"
  width="300"
  height="300"
  src={...}
  alt={...}
  placeholder={...}
/>
```

## loading values:

Here is the loading values and behaviors https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/loading
default: `lazy`

## layout values:

### `constrained`

If the width of the image is larger than the screen, the screen size is taken, otherwise the actual image size is kept

### `fixed`

regardless of the screen width, the width of the image is kept

### `fullWidth`

the width of the image is always equal to the width of the screen

## objectFit values:

Here is the objectFit values and behaviors https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
default: `cover`

## placeholder values:

You can define a placeholder to wait for the image to load.
default: `transparent`

#### `background: 'rgba(37,99,235,1)';`

<img width="320" alt="placeholder-1" src="./packages/qwik-image/assets/placeholder-1.png">

#### `background: 'linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(166,206,247,1) 0%, rgba(37,99,235,1) 83%);';`

<img width="320" alt="placeholder-2" src="./packages/qwik-image/assets/placeholder-2.png">

#### `background: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNUTX59BgAEaQJBWyqr7QAAAABJRU5ErkJggg==")';`

<img width="320" alt="placeholder-3" src="./packages/qwik-image/assets/placeholder-3.png">

#### `background: 'url("/public/placeholder.jpg") no-repeat center / cover';`

<img width="320" alt="placeholder-4" src="./packages/qwik-image/assets/placeholder-4.png">
