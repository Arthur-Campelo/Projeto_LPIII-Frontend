import { useContext } from "react";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import ContextoUsuário from "../../contextos/contexto-usuário";
import imagem from "../../imagens/imagem.jpg";
import { estilizarCard, estilizarCardHeaderCentralizado, estilizarPáginaÚnica } from "../../utilitários/estilos";

export default function PáginaInicial() {
    const { usuárioLogado } = useContext(ContextoUsuário);
    function HeaderCentralizado() {
        return (<div className={estilizarCardHeaderCentralizado()}>
            Locação de Motos para Eventos</div>)
    };
    return (
        <div className={estilizarPáginaÚnica()}>
            <Card header={HeaderCentralizado} className={estilizarCard(usuárioLogado.cor_tema)}>
                <Image src={imagem} alt="Venha Conosco!" width={1100} />
            </Card>
        </div>
    );
};