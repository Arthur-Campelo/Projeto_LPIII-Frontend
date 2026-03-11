import { createContext, useState } from "react";

const ContextoUsuário = createContext();

const ProvedorUsuário = ({ children }) => {
    const [usuárioLogado, setUsuárioLogado] = useState(null);
    const [confirmaçãoUsuário, setConfirmaçãoUsuário] = useState(null);
    const [mostrarModalConfirmação, setMostrarModalConfirmação] = useState(false);
    const [cnpjVerificado, setCnpjVerificado] = useState(null);
    const [novaSenha, setNovaSenha] = useState({});
    const [tokenRecuperação, setTokenRecuperação] = useState(null);


    return (
        <ContextoUsuário.Provider value={{
            usuárioLogado, setUsuárioLogado,
            confirmaçãoUsuário, setConfirmaçãoUsuário, mostrarModalConfirmação, setMostrarModalConfirmação,
            cnpjVerificado, setCnpjVerificado, novaSenha, setNovaSenha, tokenRecuperação, setTokenRecuperação
        }}>{children}</ContextoUsuário.Provider>
    );
}

export { ContextoUsuário as default, ProvedorUsuário }