/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-dark': '#0a0a0b',
                'brand-card': 'rgba(23, 23, 23, 0.7)',
                'brand-primary': '#10b981',
            }
        },
    },
    plugins: [],
}
