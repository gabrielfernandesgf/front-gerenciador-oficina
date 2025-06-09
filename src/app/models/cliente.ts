export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cep: string;
}

//interface para Pessoa Fisica, que estende Cliente
export interface PessoaFisica extends Cliente {
  cpf: string;
  dataDeNascimento: string;
}

// interface para PessoaJuridica, que estende Cliente
export interface PessoaJuridica extends Cliente {
  cnpj: string;
  razaoSocial: string;
  inscricaoSocial: string;
  nomeResposavel: string;
  contatoResponsavel: string;
}
