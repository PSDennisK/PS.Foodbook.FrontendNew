import type { Config } from 'tailwindcss';
import containerQueries from '@tailwindcss/container-queries';
import tailwindcssAnimate from 'tailwindcss-animate';

/**
 * Tailwind CSS v4 Configuration
 *
 * Note: In Tailwind v4, most configuration is done in CSS using @theme.
 * This config file is primarily for plugins and advanced settings.
 */
const config: Config = {
  // Tailwind v4 uses @import 'tailwindcss' in CSS instead of content scanning
  content: [],

  // Plugins
  plugins: [
    // Container queries support (@container)
    containerQueries,

    // Animation utilities (animate-in, animate-out, etc.)
    tailwindcssAnimate,
  ],

  // Future flags for compatibility
  future: {
    hoverOnlyWhenSupported: true,
  },
};

export default config;
