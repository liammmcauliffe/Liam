/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,js}",
        "./src/index.html"
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui'], // Inter looks clean
            },
            colors: {
                canvas: {
                    DEFAULT: '#0b0f14', // dark background
                    soft: '#0f151d',    // slightly lighter dark
                    ring: '#1a2431',    // for focus rings
                    glow: '#5eead4',    // teal accent
                }
            },
            boxShadow: {
                glow: '0 0 0 1px rgba(94,234,212,.25), 0 10px 30px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.04)', // nice glow effect
            },
            animation: {
                float: 'float 6s ease-in-out infinite',        // for the music bars
                pulsegrid: 'pulsegrid 8s linear infinite',     // background grid animation
                caret: 'caret 1.2s steps(1, end) infinite',    // typing cursor
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-6px)' },
                },
                pulsegrid: {
                    '0%': { opacity: '.25' },
                    '50%': { opacity: '.5' },
                    '100%': { opacity: '.25' },
                },
                caret: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0' },
                },
            }
        },
    },
    plugins: [],
}
