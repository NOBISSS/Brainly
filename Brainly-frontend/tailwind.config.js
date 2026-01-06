/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class", '[data-theme="dark"]'],
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: "var(--bg)",
                bgSecondary: "var(--bg-secondary)",
                text: "var(--text)",
                textMuted: "var(--text-muted)",
                border: "var(--border)",
                primary: "var(--primary)",
                gradientFrom: "var(--gradient-from)",
                gradientTo: "var(--gradient-to)",
            },
            gray: {
                100: "#eeeeef",
                200: "#e6e9ed",
                600: "#95989c",
            },
            purple: {
                200: "#d9ddee",
                500: "#9492db",
                600: "#7164c0",
            },
        },
    },
    plugins: [],
}