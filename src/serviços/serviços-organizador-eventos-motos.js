import servidor from "./servidor";

export function serviçoCadastrarOrganizadorEventosMotos(organizadorEventosMotos) { 
    return servidor.post("/organizador-eventos-motos", organizadorEventosMotos); 
};

export function serviçoAtualizarOrganizadorEventosMotos(organizadorEventosMotos) { 
    return servidor.patch("/organizador-eventos-motos", organizadorEventosMotos); 
};

export function serviçoBuscarOrganizadorEventosMotos(cnpj) { 
    return servidor.get(`/organizador-eventos-motos/${cnpj}`); 
};
