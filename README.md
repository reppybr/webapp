🤖 Reppy - Plataforma de Inteligência de Captação B2B

Reppy é uma plataforma SaaS (Software as a Service) B2B focada em otimizar e automatizar o processo de captação de calouros ("bixos") para repúblicas e atléticas universitárias no Brasil.

🚀 O Problema

No período pós-vestibular (Janeiro-Março), as repúblicas entram em uma "guerra" para contatar os aprovados. A fonte de dados oficial (listas da FUVEST, UNICAMP, UFSCar, etc.) é, por design, terrível:

São PDFs gigantescos ou HTMLs mal formatados.

Não existem filtros de cidade, curso ou gênero.

O processo de "garimpar" essa lista é manual, lento e ineficiente.

Quem demora mais para encontrar e contatar um calouro, perde esse calouro para a concorrência.

✨ A Solução

O Reppy automatiza todo o funil de captação, entregando os dados corretos para as pessoas certas, na hora certa.

Agregação e Enriquecimento: Um worker (ETL) monitora, processa e limpa as listas oficiais minutos após a divulgação. Os dados são centralizados e enriquecidos com informações cruciais (como cidade/campus e gênero).

Plataforma de Captação: Uma API (Flask) e um Frontend (React) entregam esses dados de forma instantânea, com filtros e paginação.

Inteligência (Premium): A plataforma funciona como um CRM de captação, permitindo que as repúblicas marquem o status (Interessado, Negou, Fechou). O plano Premium usa esses dados de forma anônima para gerar Lead Scoring (ex: "Leads Quentes"), ajudando as repúblicas a focar seu esforço em quem realmente precisa de moradia.

📋 Features Principais

Listas Centralizadas: Dados da UNICAMP, USP, UFSCar e outras em um só lugar.

Filtros Avançados: Filtre calouros por Cidade, Universidade, Curso, Gênero e Chamada.

Paginação (Performance): Acesso instantâneo aos dados (buscas feitas no backend).

CRM de Captação: Marque calouros com status (Interessado, Contatado, Fechado, Rejeitado) e adicione notas privadas.

Exportação (XLSX): Exporte seus filtros customizados para o Excel.

Painel de Inteligência (Premium):

Lead Scoring: Identifique "Leads Quentes" (calouros marcados como "Interessado" por múltiplas reps).

Filtro de Saturação: Ignore "Leads Frios" (calouros que já fecharam com outras reps).

Análise de Mercado: Gráficos de BI mostrando quais cursos e chamadas têm maior taxa de conversão.

🛠️ Stack de Tecnologia

Backend (API): Python 3.11+ com Flask.

Banco de Dados: Supabase (PostgreSQL) para armazenar os dados dos calouros (master_calouros) e as interações do CRM (republica_calouros).

Autenticação: Supabase Auth (JWT) para gerenciar usuários e repúblicas.

Pagamentos: Mercado Pago (Checkout Pro e Webhooks).

Worker (ETL/Scraping): Script Python (worker.py) que usa BeautifulSoup / Requests para parsing e o cliente supabase-py para o upload (upsert) dos dados.

Frontend: React (Vite) com TailwindCSS e Recharts.

🧭 Status do Projeto

Status: Em desenvolvimento (MVP).

Lançamento (Beta): Previsto para Jan/2025 (início da temporada de vestibulares).
