import servidor from "./servidor";

export function serviçoCadastrarLocadoraMotos(locadoraMotos) { return servidor.post("/locadoras-motos", locadoraMotos); };
export function serviçoBuscarLocadoraMotos(cnpj) { return servidor.get(`/locadoras-motos/${cnpj}`); };

