/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Garante que o Tailwind escaneie seus arquivos JSX
  ],
  theme: {
    extend: {
      // --- Todos os seus Keyframes ---
      keyframes: {
        // Animação que você já tinha
        'fade-in-up': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(20px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        
        // Novas animações de carregamento
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'spin-reverse-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' }, // Gira no sentido oposto
        },
        'pulse-fast': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        'bounce-delay': {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
          '50%': { transform: 'none', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
        },
      },

      // --- Todas as suas Animações ---
      animation: {
        // Animação que você já tinha
        'fade-in-up': 'fade-in-up 0.3s ease-out',

        // Novas animações de carregamento
        'spin-slow': 'spin-slow 3s linear infinite',
        'spin-reverse-slow': 'spin-reverse-slow 4s linear infinite', // Velocidade diferente para efeito mais dinâmico
        'pulse-fast': 'pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-delay': 'bounce-delay 1s infinite',
      },
    },
  },
  plugins: [],
}
