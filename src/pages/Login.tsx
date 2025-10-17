import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginSchema, type LoginDto } from '../types/auth.types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../components/ui/Button';
import { Loader2, UserPlus } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginDto) => {
    setError("");
    try {
      await login(data);
    //   const role = loggedInUser?.role?.toLowerCase() ?? "admin";
      navigate(`/admin/dashboard`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login Gagal");
    }
  };

  return (
    <div className="min-h-screen relative glass-effect">
      {/* Floating shapes */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full floating-animation" style={{ animationDelay: "-2s" }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-2xl floating-animation" style={{ animationDuration: "15s" }} />
      <div className="absolute top-10 right-20 w-48 h-48 bg-white/10 rounded-xl floating-animation" style={{ animationDelay: "-5s", animationDuration: "18s" }} />
      <div className="absolute bottom-5 left-20 w-52 h-52 bg-white/5 rounded-full floating-animation" style={{ animationDelay: "-8s" }} />

      <main className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md p-8 space-y-6 rounded-2xl shadow-2xl glass-effect form-fade-in"
        >
          <header className="text-center">
            <h1 className="text-2xl font-bold text-white">SISTEM ARSIP DIGITAL</h1>
            <p className="mt-2 text-sm text-white/80">Silakan masuk untuk melanjutkan.</p>
          </header>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

          <section className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="username" className="text-sm font-medium text-white/90">Username</label>
              <div className="mt-1 relative">
                <input
                  id="username"
                  type="text"
                  placeholder="Masukan username"
                  {...register("username")}
                  className="w-full pl-3 pr-3 py-3 bg-white/10 border border-white/30 rounded-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                />
              </div>
              {errors.username && <div className='mt-2'><p className="text-red-500 text-sm mt-2">{errors.username.message}</p></div>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-sm font-medium text-white/90">Password</label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full pl-3 pr-3 py-3 bg-white/10 border border-white/30 rounded-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                />
              </div>
              {errors.password && <div className='mt-2'><p className="text-red-500 text-sm">{errors.password.message}</p></div>}
            </div>
          </section>

          <div className="pt-2 space-y-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? 'Sedang login...' : 'Login'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;
