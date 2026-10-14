// Types for the VITE_* variables. Add a line here whenever you add one to

interface ViteTypeOptions {
  // Makes an unknown key like import.meta.env.VITE_TYPO a type error.
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
