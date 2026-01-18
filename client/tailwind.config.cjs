/**
 * =============================================================================
 * Tailwind CSS Configuration
 * =============================================================================
 *
 * Custom theme configuration for the NCF Grant Management demo.
 * Uses a professional color palette appropriate for a Christian foundation.
 *
 * @see https://tailwindcss.com/docs/configuration
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    // Street sign colors - dynamically applied so must be safelisted
    "from-purple-600", "to-purple-500", "from-purple-500", "to-purple-400",
    "text-purple-600", "group-hover:text-purple-500",
    "from-neon-green-600", "to-neon-green-500", "from-neon-green-500", "to-neon-green-400",
    "text-neon-green-600", "group-hover:text-neon-green-500",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Dark/Cinematic Palette
        midnight: {
          950: "#020617", // Main background (Deepest Blue)
          900: "#0f172a", // Secondary background
          800: "#1e293b", // Card background
        },
        "electric-blue": {
          400: "#60a5fa", // Text highlights
          500: "#3b82f6", // Primary buttons/accents
          600: "#2563eb", // Hover states
          900: "#1e3a8a", // Deep glow
        },
        "cyber-gold": {
          300: "#fcd34d", // Accents / Special text
          400: "#fbbf24",
          500: "#f59e0b", // Primary Gold
          600: "#d97706",
        },
        "neon-green": {
          400: "#4ade80", // Success / Go
          500: "#22c55e",
          600: "#16a34a", // Darker green for gradients
          900: "#14532d", // Deep success bg
        },
        purple: {
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
        mono: ["Fira Code", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "glass-gradient":
          "linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
        "hero-pattern":
          "radial-gradient(circle at center, rgba(16, 20, 24, 0.4) 0%, rgba(2, 6, 23, 1) 100%), linear-gradient(135deg, rgba(8, 145, 178, 0.1) 0%, rgba(76, 29, 149, 0.1) 100%)",
        "vault-pattern":
          "linear-gradient(to bottom, transparent, rgba(2, 6, 23, 1)), radial-gradient(circle at top right, rgba(250, 204, 21, 0.15), transparent 40%)",
        "circuit-pattern":
          "radial-gradient(circle at 10% 20%, rgba(250, 204, 21, 0.05) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(132, 204, 22, 0.05) 0%, transparent 20%)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.4s ease-out forwards",
        "slow-pulse": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0.7", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)" },
          "50%": { boxShadow: "0 0 25px rgba(59, 130, 246, 0.6)" },
        },
      },
      boxShadow: {
        "glow-blue": "0 0 20px -5px rgba(59, 130, 246, 0.5)",
        "glow-gold": "0 0 20px -5px rgba(245, 158, 11, 0.5)",
      },
    },
  },
  plugins: [],
};
