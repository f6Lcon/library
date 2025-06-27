/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Background cream color from the image
        cream: {
          50: "#fefdfb",
          100: "#fdfbf7",
          200: "#fbf7ef",
          300: "#f8f2e5", // Main cream background color
          400: "#f5eddb",
          500: "#f2e8d1",
          600: "#ede0c3",
          700: "#e6d4b0",
          800: "#dfc89d",
          900: "#d4b882",
        },
        // Primary Brand Color - #278585 and variations
        primary: {
          50: "#f0fdfd",
          100: "#ccfbf9",
          200: "#99f6f2",
          300: "#5eede8",
          400: "#2dd9d4",
          500: "#278585", // Main brand color
          600: "#0d7377",
          700: "#155e63",
          800: "#164e52",
          900: "#134144",
          950: "#042a2d",
        },
        // Secondary colors - warm grays that complement cream
        secondary: {
          50: "#faf9f7",
          100: "#f4f2ef",
          200: "#e8e4df",
          300: "#d6d0c9",
          400: "#b8b0a7",
          500: "#9a8f84",
          600: "#7d7066",
          700: "#665c52",
          800: "#524a42",
          900: "#433c36",
          950: "#2a2520",
        },
        // Accent color - warm orange for contrast
        accent: {
          50: "#fef7ee",
          100: "#fdedd7",
          200: "#fbd7ae",
          300: "#f8ba7a",
          400: "#f59444",
          500: "#f37320",
          600: "#e45616",
          700: "#bd4015",
          800: "#973419",
          900: "#7a2e17",
          950: "#42140a",
        },
        // Success - green tones
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        // Warning - amber tones
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        // Error - red tones
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(39, 133, 133, 0.07), 0 10px 20px -2px rgba(39, 133, 133, 0.04)",
        medium: "0 4px 25px -5px rgba(39, 133, 133, 0.1), 0 10px 10px -5px rgba(39, 133, 133, 0.04)",
        large: "0 10px 40px -10px rgba(39, 133, 133, 0.15), 0 20px 25px -5px rgba(39, 133, 133, 0.1)",
        glow: "0 0 20px rgba(39, 133, 133, 0.15)",
        "glow-lg": "0 0 40px rgba(39, 133, 133, 0.2)",
        warm: "0 4px 25px -5px rgba(243, 115, 32, 0.1), 0 10px 10px -5px rgba(243, 115, 32, 0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "bounce-gentle": "bounceGentle 2s infinite",
        float: "float 3s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
}
