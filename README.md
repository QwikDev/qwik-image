<p align="center">
<br/>
  <img width="300" src="./assets/qwik-image-logo.png" alt="The goal is a component to support performant images on the web and automatic image optimization.
That will be built as a pluggable component so devs could connect different image loaders to it (like Cloudinary, or builder)">
  <br/>
  <br/>
</p>

<h1 align='center'><a href='https://github.com/BuilderIO/qwik'>Qwik</a> Image Component</h1>

<div align='center'>
  <h3>The goal is a component to support performant images on the web and automatic image optimization.
That will be built as a pluggable component so devs could connect different image loaders to it (like builder.io or Cloudinary)</h3>
  
  <br><br>

  <a href='https://img.shields.io/npm/v/@qwik-image?label=npm%20version'>
  <img src='https://img.shields.io/npm/v/@qwik-image?label=npm%20version' alt='@qwik-image npm'>
  </a>
  <a href='https://opensource.org/licenses/MIT'>
  <img src='https://img.shields.io/badge/License-MIT-green.svg' alt='MIT'>
  </a>
  <a href='#contributors'>
  <img src='https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square' alt='All Contributors'>
  </a>

</div>
<br>

## Installation

```
npm install @qwik-image
or
yarn install @qwik-image
or
pnpm install @qwik-image
```

## Usage

### Global Provider

```
const imageTransformer$ = $(({ src, width, height }: ImageTransformerProps): string => {
  return `${src}?w=${width}&h=${height}&format=webp`;
});

// Provide your default options
useImageProvider({
  resolutions: [640], <-- You can set this prop to overwrite default values [3840, 1920, 1280, 960, 640]
  imageTransformer$,
});
```

### Image component

```
<Image
  layout="fixed"
  width="300"
  height="300"
  src={...}
  alt={...}
  placeholder={...}
/>
```

## placeholder property values:

#### `background: 'rgba(37,99,235,1)';`

<img width="312" alt="background" src="https://user-images.githubusercontent.com/35845425/223715512-d097de71-09a8-4e55-aa54-f59850e0a3a3.png">

#### `background: 'linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(166,206,247,1) 0%, rgba(37,99,235,1) 83%);';`

<img width="312" alt="linear-gradient" src="https://user-images.githubusercontent.com/35845425/223715243-a058998c-f2c3-4811-b15d-344d3fd3a891.png">

#### `background: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNUTX59BgAEaQJBWyqr7QAAAABJRU5ErkJggg==")';`

<img width="312" alt="url-data-image" src="https://user-images.githubusercontent.com/35845425/223958138-bdb0f110-460b-4fb3-a114-e7b9d63c12b6.png">

#### `background: 'url("/public/placeholder.jpg") no-repeat center / cover';`

<img width="312" alt="url-jpg" src="https://user-images.githubusercontent.com/35845425/223715374-ea5a41fa-a7df-42e1-af1b-2c0322608397.png">
