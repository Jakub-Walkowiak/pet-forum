import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    plugins: [],
    theme: {
        extend: {
            keyframes: {
                popin: {
                    '0%': { transform: 'scale(0)' },
                    '50%': { transform: 'scale(1.05)' },
                    '100%': { transform: 'scale(1)' },
                },
                fadeout: {
                    '0%': { opacity: '100%', },
                    '80%': { opacity: '100%' },
                    '100%': { opacity: '0%', },
                },
            },
            animation: {
                'pop-in': 'popin 0.4s ease-out',
                'fade-out': 'fadeout 3s ease-out'
            },
        }
    }
};

export default config;
