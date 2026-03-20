import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#19130f',
        paper: '#f4ecdf',
        umber: '#7e5532',
        ember: '#c67c36',
        moss: '#6a7861',
      },
      fontFamily: {
        display: ['Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', 'serif'],
        body: ['Georgia', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        plate: '0 24px 80px rgba(25, 19, 15, 0.18)',
      },
    },
  },
  plugins: [],
} satisfies Config;
