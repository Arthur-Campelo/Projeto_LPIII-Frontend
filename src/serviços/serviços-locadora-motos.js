import servidor from "./servidor";

export function serviçoCadastrarLocadoraMotos(locadoraMotos) { return servidor.post("/locadora-motos", locadoraMotos); };
export function serviçoBuscarLocadoraMotos(cnpj) { return servidor.get(`/locadora-motos/${cnpj}`); };

