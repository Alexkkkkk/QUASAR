/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEPLOY_QUERY_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
