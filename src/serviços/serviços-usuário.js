import servidor from "./servidor";

export function serviçoLogarUsuário(login) { return servidor.post("/usuarios/login", login); };
export function serviçoVerificarCnpjExistente(cnpj) {
    return servidor.post
        (`/usuarios/verificar-cnpj/${cnpj}`);
};