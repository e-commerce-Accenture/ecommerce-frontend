import { fazerRequisição } from "./api";

export async function Auth(email, senha) {
    const res = await fazerRequisição("/auth",{ email, password: senha });
    return res;
}

export async function Register(nome, email, senha) {
    const res = await fazerRequisição("/users/register", { name: nome, email, password: senha });
    console.log("Resposta da api", res);
    return res;
    
}