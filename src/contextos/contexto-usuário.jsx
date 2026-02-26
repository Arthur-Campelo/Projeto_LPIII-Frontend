import { createContext, useState } from "react";

const ContextoUsuário = createContext();

const ProvedorUsuário = ({ children }) => {
    const [usuárioLogado, setUsuárioLogado] = useState(null);
    const [confirmaçãoUsuário, setConfirmaçãoUsuário] = useState(null);
    const [mostrarModalConfirmação, setMostrarModalConfirmação] = useState(false);
    
    return (
        <ContextoUsuário.Provider value={{
            usuárioLogado, setUsuárioLogado,
            confirmaçãoUsuário, setConfirmaçãoUsuário, mostrarModalConfirmação, setMostrarModalConfirmação
        }}>{children}</ContextoUsuário.Provider>
    );
}

export { ContextoUsuário as default, ProvedorUsuário }