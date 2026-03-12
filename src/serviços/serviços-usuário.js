import servidor from "./servidor";

export function serviçoLogarUsuário(login) { 
    return servidor.post("/usuarios/login", login); 
};

export function serviçoVerificarCnpjExistente(cnpj) {
    return servidor.post(`/usuarios/verificar-cnpj/${cnpj}`);
};

export function serviçoRemoverUsuário(cnpj) { 
    return servidor.delete(`/usuarios/${cnpj}`); 
};

export function serviçoBuscarQuestãoSegurança(cnpj) { 
    return servidor.get(`/usuarios/questao/${cnpj}`); 
};

export function serviçoVerificarRespostaCorreta(resposta) { 
    return servidor.post("/usuarios/verificar-resposta", resposta); 
};

export function serviçoAlterarUsuário(usuário) { 
    return servidor.patch("/usuarios/alterar-usuario", usuário, { 
        headers: { Authorization: `Bearer ${usuário.tokenRecuperação}` } 
    }); 
};