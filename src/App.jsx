// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Checkout from './pages/Checkout';
// --- Importações de Layout ---
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// --- Importações de Páginas ---
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Plans from './pages/Plans';
import Services from './pages/Services';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import CompleteRegistration from './pages/CompleteRegistration';
import Test from './pages/Test';
import Contact from './pages/Contact';
import News from './pages/Novidades';
/**
 * Componente de Layout (com Navbar e Footer)
 */
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

/**
 * Layout para páginas de autenticação (sem Navbar/Footer)
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
};

/**
 * Componente principal
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="font-sans antialiased">
          <Routes>
            {/* --- Rotas que USAM o layout principal --- */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/planos" element={<Plans />} />
              <Route path="/servicos" element={<Services />} />
              <Route path="/sobre-nos" element={<AboutUs />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/novidades" element={<News />} />
            </Route>
            <Route path="/checkout" element={<Checkout />} />
            {/* --- Rotas de Autenticação (sem layout) --- */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route 
                path="/complete-registration" 
                element={
                  <ProtectedRoute>
                    <CompleteRegistration />
                  </ProtectedRoute>
                } 
              />
            </Route>

            {/* --- Rotas Protegidas --- */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* --- Rota de teste --- */}
            <Route path="/test" element={<Test />} />

            {/* --- Rota "Catch-all" --- */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;