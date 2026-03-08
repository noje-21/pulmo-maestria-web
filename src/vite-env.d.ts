/// <reference types="vite/client" />

// vite-imagetools: images are auto-converted to webp at build time
declare module "*.jpg" {
  const src: string;
  export default src;
}
declare module "*.png" {
  const src: string;
  export default src;
}
