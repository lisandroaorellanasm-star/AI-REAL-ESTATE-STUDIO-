import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

const AuthForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            // If user doesn't exist, try to sign up
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: window.location.origin
                }
            });
            if (signUpError) {
                setMessage({ type: 'error', text: signUpError.message });
            } else {
                setMessage({ type: 'success', text: 'Revisa tu correo para confirmar tu cuenta.' });
            }
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) setMessage({ type: 'error', text: error.message });
        setLoading(false);
    };

    return (
        <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-6 text-center">Bienvenido</h2>

            {message && (
                <div className={`p-3 rounded-xl mb-4 text-xs font-bold ${message.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-1.5 ml-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="tu@email.com"
                        required
                    />
                </div>
                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-1.5 ml-1">Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="••••••••"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-black py-4 rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-50"
                >
                    {loading ? 'Cargando...' : 'Entrar / Registrarse'}
                </button>
            </form>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                    <span className="bg-transparent px-4 text-white/40">O continúa con</span>
                </div>
            </div>

            <button
                onClick={handleGoogleLogin}
                className="w-full bg-white text-gray-900 font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-3 hover:bg-gray-100"
            >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                <span>Google</span>
            </button>

            <p className="mt-6 text-[10px] text-center text-white/40 uppercase tracking-widest">
                Acceso rápido y seguro
            </p>
        </div>
    );
};

export default AuthForm;
