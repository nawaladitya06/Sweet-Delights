/** @type {import('tailwindcss').Config} */
export default {
  // Force rebuild
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Semantic Colors
        primary: {
          DEFAULT: "#5D4037", // Chocolate (Primary Brand Color)
          dark: "#3E2723",    // Dark Chocolate
          hover: "#4E342E",   // Medium Chocolate
        },
        secondary: {
          DEFAULT: "#FFF8E1", // Cream (Secondary Brand Color)
          dark: "#D7CCC8",    // Darker Cream/Latte
        },
        accent: {
          DEFAULT: "#D32F2F", // Cherry Red
          hover: "#B71C1C",   // Darker Cherry
          light: "#EF5350",   // Light Red
        },
        background: {
          light: "#FFF8E1", // Cream Background
          dark: "#3E2723",  // Dark Chocolate Background
        },
        surface: {
          light: "#FFFFFF", // White/Light Cream for cards
          dark: "#4E342E",  // Medium Chocolate for cards in dark mode
        },
        text: {
          primary: {
            light: "#3E2723", // Dark Chocolate Text on Light
            dark: "#FFF8E1",  // Cream Text on Dark
          },
          secondary: {
            light: "#5D4037", // Lighter Chocolate Text
            dark: "#D7CCC8",  // Dark Cream Text
          },
          muted: "var(--text-muted)",
        },
        success: "#2E7D32",
        error: "#C62828",
      },
      boxShadow: {
        'cherry-glow': '0 0 15px rgba(211, 47, 47, 0.3)',
        'cherry-glow-lg': '0 0 25px rgba(211, 47, 47, 0.5)',
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        display: ["Playfair Display", "serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
