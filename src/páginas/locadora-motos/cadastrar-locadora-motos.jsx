import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import { serviçoCadastrarLocadoraMotos, serviçoBuscarLocadoraMotos, serviçoAtualizarLocadoraMotos } from "../../serviços/serviços-locadora-motos";
import mostrarToast from "../../utilitários/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios } from "../../utilitários/validações";
import {
    estilizarBotão, estilizarBotãoRetornar, estilizarCard, estilizarDivCampo, estilizarDivider,
    estilizarDropdown, estilizarFlex, estilizarInlineFlex, estilizarInputNumber, estilizarLabel
} from "../../utilitários/estilos";

export default function CadastrarLocadoraMotos() {
    const referênciaToast = useRef(null);
    const navegar = useNavigate();
    const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);

    const [dados, setDados] = useState({ classificação: "", qnt_disponíveis: "" });
    const [erros, setErros] = useState({});
    const [cnpjExistente, setCnpjExistente] = useState(false);

    const opçõesClassificação = [
        { label: "Não classificado", value: "não_classificado" }, { label: "Baixo", value: "baixo" },
        { label: "Médio", value: "médio" }, { label: "Alto", value: "alto" }];

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
        if (usuárioLogado?.cadastrado) return "Alterar Locadora de Motos";
        else return "Cadastrar Locadora de Motos";
    };
    async function atualizarLocadoraMotos() {
        if (validarCampos()) {
            try {
                const response = await serviçoAtualizarLocadoraMotos({ ...dados, cnpj: usuárioLogado.cnpj });
                if (response) mostrarToast(referênciaToast, "Locadora de Motos atualizada com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
        }
    };
    async function cadastrarLocadoraMotos() {
        if (validarCampos()) {
            try {
                const response = await serviçoCadastrarLocadoraMotos({
                    ...dados, usuário_info: usuárioLogado,
                    classificação: dados.classificação,
                    qnt_disponíveis: dados.qnt_disponíveis
                });
                if (response.data)
                    setUsuárioLogado(usuário => ({
                        ...usuário, status: response.data.status,
                        token: response.data.token
                    }));
                mostrarToast(referênciaToast, "Locadora cadastrada com sucesso!", "sucesso");
            } catch (error) {
                setCnpjExistente(true);
                mostrarToast(referênciaToast, error.response.data.erro, "erro");
            }
        }
    };
    function labelBotãoSalvar() {
        if (usuárioLogado?.cadastrado) return "Alterar";
        else return "Cadastrar";
    };
    function açãoBotãoSalvar() {
        if (usuárioLogado?.cadastrado) atualizarLocadoraMotos();
        else cadastrarLocadoraMotos();
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
        async function buscarDadosLocadoraMotos() {
            try {
                const response = await serviçoBuscarLocadoraMotos(usuárioLogado.cnpj);
                if (!desmontado && response.data) {
                    setDados(dados => ({
                        ...dados, classificação: response.data.classificação,
                        qnt_disponíveis: response.data.qnt_disponíveis
                    }));
                }
            } catch (error) {
                const erro = error.response.data.erro;
                if (erro) mostrarToast(referênciaToast, erro, "erro");
            }
        }
        if (usuárioLogado?.cadastrado) buscarDadosLocadoraMotos();
        return () => desmontado = true;
    }, [usuárioLogado?.cadastrado, usuárioLogado.cnpj]);
    return (
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} onHide={redirecionar} position="bottom-center" />

            <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>

                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Classificação*:</label>
                    <Dropdown name="classificação"
                        className={estilizarDropdown(erros.classificação, usuárioLogado.cor_tema)}
                        value={dados.classificação} options={opçõesClassificação} onChange={alterarEstado}
                        placeholder="-- Selecione --" />
                    <MostrarMensagemErro mensagem={erros.classificação} />
                </div>

                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>
                        Quantidade de Modelos disponíveis*:</label>
                    <InputNumber name="qnt_disponíveis" size={5}
                        value={dados.qnt_disponíveis}
                        onValueChange={alterarEstado} mode="decimal"
                        inputClassName={estilizarInputNumber(erros.qnt_disponíveis,
                            usuárioLogado.cor_tema)} />
                    <MostrarMensagemErro mensagem={erros.qnt_disponíveis} />
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