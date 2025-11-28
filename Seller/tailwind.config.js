/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Gray Scale (Slate tones)
        gray: {
          50: '#F9FAFB',   // Premium page background
          100: '#F3F4F6',  // Card backgrounds, hover states
          200: '#E5E7EB',  // Subtle borders
          300: '#D1D5DB',  // Dividers
          400: '#9CA3AF',  // Placeholder text
          500: '#6B7280',  // Secondary text
          600: '#4B5563',  // Body text
          700: '#374151',  // Strong body text
          800: '#1F2937',  // Subheadings
          900: '#111827',  // Headings, primary text
        },
        // Premium Indigo Primary
        primary: {
          50: '#EEF2FF',   // Active/selected backgrounds
          100: '#E0E7FF',  // Hover backgrounds
          200: '#C7D2FE',  // Light borders
          300: '#A5B4FC',  // Focus rings
          400: '#818CF8',  // Icons secondary
          500: '#6366F1',  // Icons, links
          600: '#4F46E5',  // Primary buttons, active states
          700: '#4338CA',  // Hover state
          800: '#3730A3',  // Active pressed
          900: '#312E81',  // Dark accent
          DEFAULT: '#4F46E5',
        },
        // Success/Error/Warning
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.06)',
        'premium': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'premium-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
};