import { Route, BrowserRouter, Routes } from "react-router-dom";
import RotasUsuárioLogado from "./rotas-usuário-logado";
import LogarUsuário from "../páginas/usuário/logar-usuário";
import CadastrarUsuário from "../páginas/usuário/cadastrar-usuário";
import PáginaInicial from "../páginas/usuário/página-inicial";
import CadastrarLocadoraMotos from "../páginas/locadora-motos/cadastrar-locadora-motos";
import RecuperarAcesso from "../páginas/usuário/recuperar-acesso";
import CadastrarOrganizadoEventosMotos from "../páginas/organizador-eventos-motos/cadastrar-organizador-eventos-motos";


export default function RotasAplicação() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<LogarUsuário />} path="/" />
                <Route element={<CadastrarUsuário />} path="criar-usuario" />
                <Route element={<RecuperarAcesso/>} path="recuperar-acesso"/>
                <Route element={<RotasUsuárioLogado />}>
                    <Route element={<PáginaInicial />} path="pagina-inicial" />
                    <Route element={<CadastrarUsuário />} path="atualizar-usuario" />
                    <Route element={<CadastrarLocadoraMotos />} path="cadastrar-locadora-motos" />
                    <Route element={<CadastrarOrganizadoEventosMotos/>} path="cadastrar-organizador-eventos-motos"/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
