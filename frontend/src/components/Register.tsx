import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await register(name, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-600 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900 flex items-center justify-center p-6">
      <div className="relative w-full max-w-md rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
        <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-fuchsia-400/30 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-400/30 blur-3xl" />

        <div className="relative p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-white">Register</h2>
          {error && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-purple-300/60"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-purple-300/60"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-purple-300/60"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-3 font-medium text-white shadow-lg transition hover:from-fuchsia-400 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/60"
            >
              Register
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/70">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;