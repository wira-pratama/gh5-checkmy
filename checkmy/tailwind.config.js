module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
        "./app.vue",
    ],
    theme: {
        extend: {
            fontFamily: {
                'primary': ['Plus Jakarta Sans', 'sans-serif'],
                'secondary': ['Poppins', 'sans-serif'],
            },
            colors: {
                'primary-key': '#3104EE',
                'enchancement': '#11EC06',
                'catalyst': '#F3F82C',
                'initial': '#FA0000',
                'psychological': '#CA1EDC',
                'behavioral': '#FC9110',
                'environmental': '#807A80',
            },
        }
    },
    daisyui: {
        themes: [
            {
                mytheme: {
                    "primary": "#47cc47",
                    "secondary": "#e8bf61",
                    "accent": "#9e96e8",
                    "neutral": "#23233e",
                    "base-100": "#fafafa",
                    "info": "#94d8f9",
                    "success": "#127862",
                    "warning": "#f6ac3c",
                    "error": "#eb7a92",
                },
            },
        ],
    },
    plugins: [require("daisyui")],
}