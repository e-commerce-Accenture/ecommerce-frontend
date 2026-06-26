import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Register } from '../services/authService';

export function Cadastro() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    const handleRegister = async (event) => {
        event.preventDefault();
        setErro('');

        if (!hasMinLength || !hasUppercase || !hasNumber || !hasSpecialChar) {
            setErro('A senha não atende a todos os requisitos de segurança.');
            return;
        }

        try {
            const data = await Register(name, email, password);
            console.log("resposta da API:", data);
            localStorage.setItem('user_email', email);
            navigate('/login'); 
        } catch (error) {
            console.error("Erro completo no cadastro:", error);
            setErro(error.message || 'Erro de conexão com o servidor de autenticação.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans bg-gray-50">
            <div className="sm:mx-auto w-full max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Criar Nova Conta</h2>
            </div>

            <div className="mt-8 sm:mx-auto w-full max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    {erro && <p className="mb-4 text-sm font-medium text-red-600 text-center">{erro}</p>}

                    <form className="space-y-6" onSubmit={handleRegister}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left">Nome Completo</label>
                            <div className="mt-1">
                                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
                            </div>
                        </div>

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
                            {password && (
                                <div className="mt-2.5 text-xs space-y-1 text-left">
                                    <p className="font-semibold text-gray-500 mb-1.5">A senha deve conter:</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className={hasMinLength ? "text-green-600 font-bold" : "text-gray-400"}>
                                            {hasMinLength ? "✓" : "○"} Mínimo de 8 caracteres
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className={hasUppercase ? "text-green-600 font-bold" : "text-gray-400"}>
                                            {hasUppercase ? "✓" : "○"} Pelo menos uma letra maiúscula
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className={hasNumber ? "text-green-600 font-bold" : "text-gray-400"}>
                                            {hasNumber ? "✓" : "○"} Pelo menos um número
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className={hasSpecialChar ? "text-green-600 font-bold" : "text-gray-400"}>
                                            {hasSpecialChar ? "✓" : "○"} Pelo menos um caractere especial (Ex: @, #, $, etc.)
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors">
                                Criar conta
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Já tem uma conta?{' '}
                        <Link to="/login" className="font-medium text-gray-900 hover:underline">
                            Fazer Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}