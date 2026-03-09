const CNPJ_MÁSCARA = "99.999.999/9999-99";
const limparMascara = (valor) => valor.replace(/\D/g, '');

export { CNPJ_MÁSCARA, limparMascara };