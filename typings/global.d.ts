// Minimal global types to make Volar happy without installing Vue locally.
// Avoid importing from 'vue' so node_modules is not required in HBuilderX projects.

declare module "*.vue" {
  const component: any;
  export default component;
}

// uni-app global
declare const uni: any;

export {};
