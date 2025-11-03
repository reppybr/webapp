import React, { useState } from 'react';

const Contact = () => {
  const brightGreen = '#1bff17';
  const greenGradient = 'from-[#1bff17] to-[#14cc11]';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    subject: '',
    message: '',
    plan: 'starter'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulação de envio
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Mensagem enviada com sucesso! Entraremos em contato em até 24h.');
      setFormData({
        name: '',
        email: '',
        company: '',
        role: '',
        subject: '',
        message: '',
        plan: 'starter'
      });
    }, 2000);
  };

  const contactMethods = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      value: 'contato@reppy.com',
      description: 'Resposta em até 4h',
      action: 'mailto:contato@reppy.com'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Telefone',
      value: '(11) 99999-9999',
      description: 'Segunda a Sexta, 9h-18h',
      action: 'tel:+5511999999999'
    }
  ];

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Para repúblicas menores'
    },
    {
      id: 'growth',
      name: 'Growth',
      description: 'Para atléticas e redes'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Personalizado'
    }
  ];

  const faqs = [
    {
      question: 'Quanto tempo leva para implementar?',
      answer: 'A implementação é instantânea. Após o cadastro, você tem acesso imediato à plataforma.'
    },
    {
      question: 'Oferecem teste gratuito?',
      answer: 'Sim! Oferecemos 14 dias gratuitos para você testar todas as funcionalidades.'
    },
    {
      question: 'Tem suporte técnico?',
      answer: 'Oferecemos suporte por email e WhatsApp com tempo de resposta médio de 2 horas.'
    }
  ];

  return (
    <main className="font-sans antialiased bg-white">
      {/* Hero Section */}
      <section className="min-h-[50vh] flex items-center justify-center px-6 bg-gradient-to-br from-gray-50 to-white relative py-16">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle, ${brightGreen} 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Fale com a{' '}
            <span className="relative">
              <span className="relative z-10" style={{ color: brightGreen }}>gente</span>
              <div className="absolute bottom-2 left-0 w-full h-4 bg-[#1bff17]/20 -rotate-1 z-0"></div>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Estamos aqui para ajudar sua república ou atlética a crescer. 
            Entre em contato e veja como podemos transformar seu processo.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="lg:pr-12">
              <div className="mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Vamos conversar sobre sua república
                </h2>
                <p className="text-xl text-gray-600">
                  Preencha o formulário e nosso time especializado entrará em contato 
                  para entender suas necessidades específicas.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                      Seu nome completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#1bff17] focus:ring-2 focus:ring-[#1bff17]/20 transition-all duration-300 outline-none"
                      placeholder="João Silva"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                      Email profissional *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#1bff17] focus:ring-2 focus:ring-[#1bff17]/20 transition-all duration-300 outline-none"
                      placeholder="joao@republica.com"
                    />
                  </div>
                </div>

                {/* Company Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-gray-900 mb-2">
                      Nome da república/atlética *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#1bff17] focus:ring-2 focus:ring-[#1bff17]/20 transition-all duration-300 outline-none"
                      placeholder="República Alpha"
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-semibold text-gray-900 mb-2">
                      Seu cargo *
                    </label>
                    <select
                      id="role"
                      name="role"
                      required
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#1bff17] focus:ring-2 focus:ring-[#1bff17]/20 transition-all duration-300 outline-none bg-white"
                    >
                      <option value="">Selecione...</option>
                      <option value="president">Presidente</option>
                      <option value="vice_president">Vice-presidente</option>
                      <option value="treasurer">Tesoureiro</option>
                      <option value="member">Membro</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>
                </div>

                {/* Plan Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-4">
                    Plano de interesse
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {plans.map((plan) => (
                      <label
                        key={plan.id}
                        className={`relative flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                          formData.plan === plan.id
                            ? 'border-[#1bff17] bg-[#1bff17]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="plan"
                          value={plan.id}
                          checked={formData.plan === plan.id}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className={`font-semibold mb-1 ${
                            formData.plan === plan.id ? 'text-[#1bff17]' : 'text-gray-900'
                          }`}>
                            {plan.name}
                          </div>
                          <div className="text-xs text-gray-600">{plan.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                    Como podemos ajudar? *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#1bff17] focus:ring-2 focus:ring-[#1bff17]/20 transition-all duration-300 outline-none resize-none"
                    placeholder="Descreva suas necessidades, quantos membros têm, quais universidades atendem, etc..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r ${greenGradient} text-white font-bold text-lg py-4 px-8 rounded-2xl shadow-lg shadow-green-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Enviando...
                    </div>
                  ) : (
                    'Enviar Mensagem →'
                  )}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Ao enviar, você concorda com nossa{' '}
                  <a href="#" className="text-[#1bff17] hover:underline">Política de Privacidade</a>
                </p>
              </form>
            </div>

            {/* Contact Info & FAQ */}
            <div className="lg:pl-12">
              {/* Contact Methods */}
              <div className="mb-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">
                  Outras formas de contato
                </h3>
                <div className="space-y-6">
                  {contactMethods.map((method, index) => (
                    <a
                      key={index}
                      href={method.action}
                      className="flex items-start p-6 rounded-2xl border border-gray-200 hover:border-[#1bff17]/20 hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 flex items-center justify-center text-gray-600 group-hover:text-[#1bff17] transition-colors duration-300 mr-4">
                        {method.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{method.title}</h4>
                        <p className="text-gray-900 text-lg font-medium mb-1">{method.value}</p>
                        <p className="text-gray-600 text-sm">{method.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8">
                  Perguntas frequentes
                </h3>
                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div key={index} className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-3">{faq.question}</h4>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Card */}
              <div className="mt-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  Agende uma demonstração personalizada
                </h3>
                <p className="text-gray-300 mb-6">
                  Quer ver a plataforma em ação? Agende uma call de 30 minutos 
                  com nosso especialista e receba uma análise personalizada.
                </p>
                <button className="w-full bg-white text-gray-900 font-bold py-3 px-6 rounded-2xl hover:bg-gray-100 transition-all duration-300">
                  Agendar Demonstração
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    
    </main>
  );
};

export default Contact;