import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ModalRecuperarAcesso from "../../componentes/modais/modal-recuperar-acesso";
import mostrarToast from "../../utilitários/mostrar-toast";
import { CNPJ_MÁSCARA } from "../../utilitários/máscaras";
import { serviçoBuscarQuestãoSegurança, serviçoVerificarRespostaCorreta }from "../../serviços/serviços-usuário";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios, validarCnpj } from "../../utilitários/validações";
import {
    TAMANHOS, estilizarBotão, estilizarCard, estilizarDialog, estilizarDivCampo, estilizarFlex,
    estilizarFooterDialog, estilizarInputMask, estilizarInputText, estilizarLabel, estilizarLink,
    estilizarParágrafo
} from "../../utilitários/estilos";

export default function RecuperarAcesso() {
    const referênciaToast = useRef(null);
    const { setCnpjVerificado, setNovaSenha, setTokenRecuperação } = useContext(ContextoUsuário);
    const [dados, setDados] = useState({ cnpj: "", questão: "", resposta: "", token: "" });
    const [mostrarModal, setMostrarModal] = useState(false);
    const [desabilitar, setDesabilitar] = useState(true);
    const [timer, setTimer] = useState(null);
    const [erros, setErros] = useState({});

    function alterarEstado(event) {
        const chave = event.target.name || event.value;
        const valor = event.target.value;
        setDados({ ...dados, [chave]: valor });
    };

    function validarCampos() {
        let errosCamposObrigatórios = validarCamposObrigatórios({ resposta: dados.resposta });
        setErros(errosCamposObrigatórios);
        return checarListaVazia(errosCamposObrigatórios);
    };

    function esconderModal() {
        setNovaSenha({});
        setMostrarModal(false);
    };

    async function buscarQuestãoSegurança(event) {
        const cnpj = event.target.value;
        setDados({ ...dados, cnpj });
        clearTimeout(timer);

        const novoTimer = setTimeout(async () => {
            try {
                if (validarCnpj(event.target.value)) {
                    const response = await serviçoBuscarQuestãoSegurança(cnpj);
                    setDesabilitar(false);
                    setDados({ ...dados, cnpj, questão: response.data.questão });
                }
            } catch (error) {
                mostrarToast(referênciaToast, error.response.data.mensagem, "erro");
                setDados({ ...dados, questão: "" });
            }
        }, 1500);
        setTimer(novoTimer);
    };

    async function verificarRespostaCorreta() {
        try {
            const cnpj = dados.cnpj;
            const response = await serviçoVerificarRespostaCorreta({ cnpj, resposta: dados.resposta });
            setCnpjVerificado(cnpj);
            setTokenRecuperação(response.data.token);
            setMostrarModal(true);
        } catch (error) { mostrarToast(referênciaToast, error.response.data.mensagem, "erro"); }
    };

    async function validarConfirmarRecuperaçãoAcesso() {
        if (validarCampos()) { await verificarRespostaCorreta(); }
    };

    return (
        <div className={estilizarFlex("center")}>
            <Toast ref={referênciaToast} position="bottom-center" />
            <Dialog visible={mostrarModal} className={estilizarDialog()}
                header="Digite sua nova senha e confirme" onHide={esconderModal}
                footer={<div className={estilizarFooterDialog()}></div>}>
                <ModalRecuperarAcesso />
            </Dialog>

            <Card title="Recuperar Acesso de Usuário" className={estilizarCard()}>
                <p className={estilizarParágrafo()}>
                    {`Para recuperar o acesso à sua conta, forneça as informações abaixo:`}</p>

                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel()}>CNPJ*:</label>
                    <InputMask name="cnpj" className={estilizarInputMask(erros.cnpj)} size={TAMANHOS.CNPJ}
                        mask={CNPJ_MÁSCARA} autoClear value={dados.cnpj} onChange={buscarQuestãoSegurança} unmask/>
                </div>

                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel()}>Questão de segurança*:</label>
                    <InputText name="questão" className={estilizarInputText(erros.questão, 400)}
                        value={dados.questão} disabled />
                </div>

                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel()}>Resposta*:</label>
                    <InputText name="resposta" className={estilizarInputText(erros.resposta, 350)}
                        disabled={desabilitar} value={dados.resposta} onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.resposta} />
                </div>

                <div className={estilizarFlex()}>
                    <Button className={estilizarBotão()} label="Confirmar" disabled={desabilitar}
                        onClick={validarConfirmarRecuperaçãoAcesso} />
                    <Link to="/" className={estilizarLink()}>Voltar ao Login</Link>
                </div>
            </Card>
        </div>
    );
}
