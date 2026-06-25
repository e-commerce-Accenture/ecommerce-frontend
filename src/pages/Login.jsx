import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Auth } from '../services/authService';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setErro('');
        try {
            const data = await Auth(email, password);

            const payload = JSON.parse(atob(data.accessToken.split('.')[1]));

            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('user_email', payload.email);
            localStorage.setItem('user_role', payload.role);

            window.dispatchEvent(new CustomEvent('authChange'));

            if (payload.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            setErro(error.message || 'Erro de conexão com o servidor de autenticação.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans bg-gray-50">
            <div className="sm:mx-auto w-full max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Acesse sua conta</h2>
            </div>

            <div className="mt-8 sm:mx-auto w-full max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    {erro && <p className="mb-4 text-sm font-medium text-red-600 text-center">{erro}</p>}

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">E-mail</label>
                            <div className="mt-1">
                                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left">Senha</label>
                            <div className="mt-1">
                                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors">
                                Entrar
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Não tem uma conta?{' '}
                        <Link to="/cadastro" className="font-medium text-gray-900 hover:underline">
                            Cadastre-se
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}