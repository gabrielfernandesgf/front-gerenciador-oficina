export interface Funcionario {
  id: number;
  cpf: string;
  nome: string;
  dataEntrada: string; // (ex: "2025-06-10")
  dataSaida?: string;
  telefone: string;
  email: string;
}
