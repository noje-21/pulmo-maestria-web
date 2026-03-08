/// <reference types="vite/client" />

// vite-imagetools presets
declare module "*?responsive" {
  const srcset: string;
  export default srcset;
}
declare module "*?mobile" {
  const src: string;
  export default src;
}
