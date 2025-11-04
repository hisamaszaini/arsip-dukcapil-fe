import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative glass-effect overflow-hidden">
      {/* Floating shapes */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full floating-animation" style={{ animationDelay: "-2s" }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-2xl floating-animation" style={{ animationDuration: "15s" }} />
      <div className="absolute top-10 right-20 w-48 h-48 bg-white/10 rounded-xl floating-animation" style={{ animationDelay: "-5s", animationDuration: "18s" }} />
      <div className="absolute bottom-5 left-20 w-52 h-52 bg-white/5 rounded-full floating-animation" style={{ animationDelay: "-8s" }} />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
          Selamat Datang di Sistem Arsip Digital
        </h1>
        <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Kelola arsip Anda dengan mudah dan aman. Masuk untuk mengakses dashboard dan fitur-fitur lengkap.
        </p>
        <div className="space-x-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Masuk <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
