import axios from "axios";
import servidor from "./servidor";

const servidor = axios.create({ baseURL: process.env.REACT_APP_API_URL });

export default servidor;
export function serviçoCadastrarLocadoraMotos(locadoraMotos) { return servidor.post("/locadoras-motos", locadoraMotos); };
export function serviçoBuscarLocadoraMotos(cnpj) { return servidor.get(`/locadoras-motos/${cnpj}`); };