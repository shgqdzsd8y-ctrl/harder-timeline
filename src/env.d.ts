/// <reference types="vite/client" />

// Global ambient type augmentations — no imports/exports so this is truly global.

interface TurnstileWidget {
  render: (
    container: string | HTMLElement,
    options: {
      sitekey: string;
      callback?: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
      theme?: 'light' | 'dark' | 'auto';
      size?: 'normal' | 'compact';
    },
  ) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
}

interface Window {
  turnstile?: TurnstileWidget;
}
