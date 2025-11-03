import React from 'react';

// Ícones simples de mídia social (SVG)
const FacebookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.107 4.107 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);
const InstagramIcon = () => (
    <svg
      className="w-6 h-6"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm4.5-.9a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2z" />
    </svg>
  );
// Cor verde brilhante "reppy"
const brightGreen = '#32ff00';

const Footer = () => {
  return (
    <footer className="bg-white text-black font-sans" style={{ borderTop: `2px solid ${brightGreen}` }}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo e Mídias Sociais */}
          <div className="space-y-4">
            <a href="/" className="inline-block">
              <img 
                className="h-10 w-auto" 
                src="/logo_preto.png" 
                alt="Reppy Logo" 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.style.display = 'none';
                  const fallback = document.createElement('span');
                  fallback.className = 'text-black text-4xl font-bold';
                  fallback.innerText = 'reppy';
                  e.target.parentNode.replaceChild(fallback, e.target);
                }}
              />
            </a>
            <p className="text-gray-600">
              Organizando o mundo acadêmico.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-black">
                <span className="sr-only">Facebook</span>
                <FacebookIcon />
              </a>
              <a target='_blank' href="https://www.instagram.com/reppy_br/" className="text-gray-500 hover:text-black">
                <span className="sr-only">Instagram</span>
                <InstagramIcon />
              </a>
              <a href="#" className="text-gray-500 hover:text-black">
                <span className="sr-only">Twitter</span>
                <TwitterIcon />
              </a>
            </div>
          </div>

          {/* Links: Produto */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Produto</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="/planos" className="text-base text-gray-600 hover:text-black">Planos</a></li>
              <li><a href="/servicos" className="text-base text-gray-600 hover:text-black">Serviços</a></li>
              <li><a href="/novidades" className="text-base text-gray-600 hover:text-black">Novidades</a></li>
            </ul>
          </div>

          {/* Links: Empresa */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Startup</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="/sobre-nos" className="text-base text-gray-600 hover:text-black">Sobre nós</a></li>
              <li><a href="/contato" className="text-base text-gray-600 hover:text-black">Contato</a></li>
            </ul>
          </div>

          {/* Links: Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-base text-gray-600 hover:text-black">Privacidade</a></li>
              <li><a href="#" className="text-base text-gray-600 hover:text-black">Termos de Uso</a></li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Reppy. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Esta é a linha que estava faltando e corrige o erro:
export default Footer;
