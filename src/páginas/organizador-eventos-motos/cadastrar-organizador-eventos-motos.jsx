import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import { TELEFONE_MÁSCARA } from "../../utilitários/máscaras";
import { serviçoCadastrarOrganizadorEventosMotos, serviçoAtualizarOrganizadorEventosMotos, serviçoBuscarOrganizadorEventosMotos }
 from "../../serviços/serviços-organizador-eventos-motos";
import mostrarToast from "../../utilitários/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios } from "../../utilitários/validações";
import {
    TAMANHOS, estilizarBotão, estilizarBotãoRetornar, estilizarCard, estilizarDivCampo,
    estilizarDivider, estilizarDropdown, estilizarFlex, estilizarInlineFlex, estilizarInputMask,
    estilizarInputText, estilizarLabel
} from "../../utilitários/estilos";

export default function CadastrarOrganizadorEventosMotos() {

    const referênciaToast = useRef(null);
    const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);
    const [dados, setDados] = useState({ cidade: "", tipo: "", telefone: "" });
    const [erros, setErros] = useState({});
    const [cnpjExistente, setCnpjExistente] = useState(false);
    const navegar = useNavigate();
    const opçõesTipo = [{ label: "Eventos Beneficentes", value: "beneficente" },
    { label: "Eventos Lucrativos", value: "lucrativo" },
    { label: "Eventos Esportivos", value: "esportivo" }];
    
    function alterarEstado(event) {
        const chave = event.target.name || event.value;
        const valor = event.target.value;
        setDados({ ...dados, [chave]: valor });
    };
    function validarCampos() {
        let errosCamposObrigatórios;
        errosCamposObrigatórios = validarCamposObrigatórios(dados);
        setErros(errosCamposObrigatórios);
        return checarListaVazia(errosCamposObrigatórios);
    };
    function títuloFormulário() {
        if (usuárioLogado?.cadastrado) return "Alterar Organizador de Eventos de Motos";
        else return "Cadastrar Organizador de Eventos de Motos";
    };
    async function CadastrarOrganizadorEventosMotos() {
        if (validarCampos()) {
            try {
                const response = await serviçoCadastrarOrganizadorEventosMotos({
                    ...dados, usuário_info: usuárioLogado,
                    cidade: dados.cidade, tipo: dados.tipo,  telefone: dados.telefone
                });
                if (response.data)
                    setUsuárioLogado(usuário => ({
                        ...usuário, status: response.data.status,
                        token: response.data.token
                    }));
                mostrarToast(referênciaToast, "Organizador de Eventos de Motos cadastrado com sucesso!", "sucesso");
            } catch (error) {
                setCnpjExistente(true);
                mostrarToast(referênciaToast, error.response.data.erro, "erro");
            }
        }
    };
    async function atualizarOrganizadorEventosMotos() {
        if (validarCampos()) {
            try {
                const response = await serviçoAtualizarOrganizadorEventosMotos({ ...dados, cnpj: usuárioLogado.cnpj });
                if (response) mostrarToast(referênciaToast, "Organizador eventos de motos atualizado com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
        }
    };
    function labelBotãoSalvar() {
        if (usuárioLogado?.cadastrado) return "Alterar";
        else return "Cadastrar";
    };
    function açãoBotãoSalvar() {
        if (usuárioLogado?.cadastrado) atualizarOrganizadorEventosMotos();
        else cadastrarOrganizadorEventosMotos();
    };
    function redirecionar() {
        if (cnpjExistente) {
            setUsuárioLogado(null);
            navegar("/criar-usuario");
        } else {
            setUsuárioLogado(usuárioLogado => ({ ...usuárioLogado, cadastrado: true }));
            navegar("/pagina-inicial");
        }
    };
    useEffect(() => {
        let desmontado = false;
        async function buscarDadosOrganizadoEventosMotos() {
            try {
                const response = await serviçoBuscarOrganizadorEventosMotos(usuárioLogado.cnpj);
                if (!desmontado && response.data) {
                    setDados(dados => ({
                        ...dados, cidade: response.data.cidade,
                        tipo: response.data.tipo,
                        telefone: response.data.telefone
                    }));
                }
            } catch (error) {
                const erro = error.response.data.erro;
                if (erro) mostrarToast(referênciaToast, erro, "erro");
            }
        }
        if (usuárioLogado?.cadastrado) buscarDadosOrganizadoEventosMotos();
        return () => desmontado = true;
    }, [usuárioLogado?.cadastrado, usuárioLogado.cnpj]);

    return (
        <div className={estilizarFlex()}>

            <Toast ref={referênciaToast} onHide={redirecionar} position="bottom-center" />
            <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>

                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Cidade*:</label>
                    <InputText name="cidade" autoClear onChange={alterarEstado}
                        className={estilizarInputText(erros.cidade, usuárioLogado.cor_tema)}
                        value={dados.cidade} />
                    <MostrarMensagemErro mensagem={erros.cidade} />
                </div>

                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Tipo de Eventos*:</label>
                    <Dropdown name="tipo" className={estilizarDropdown(erros.tipo, usuárioLogado.cor_tema)}
                        value={dados.tipo} options={opçõesTipo} onChange={alterarEstado}
                        placeholder="-- Selecione --" />
                    <MostrarMensagemErro mensagem={erros.tipo} />
                </div> 

                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Telefone*:</label>
                    <InputMask name="telefone" autoClear size={TAMANHOS.TELEFONE} onChange={alterarEstado}
                        className={estilizarInputMask(erros.telefone, usuárioLogado.cor_tema)}
                        mask={TELEFONE_MÁSCARA} value={dados.telefone} />
                    <MostrarMensagemErro mensagem={erros.telefone} />
                </div>

                <Divider className={estilizarDivider(dados.cor_tema)} />

                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={redirecionar} />
                    <Button className={estilizarBotão()} label={labelBotãoSalvar()} onClick={açãoBotãoSalvar} />
                </div>
            </Card>
        </div>
    );
};