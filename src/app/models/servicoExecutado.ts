import { Funcionario } from "./funcionario";
import { OS } from "./os";
import { Servico } from "./servico";

export interface ServicoExecutado {
  id?: number;
  dataInicio: string;
  dataFim: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal?: number;
  descricao: string;
  os?: OS;
  servico?: Servico;
  funcionario?: Funcionario;
}
