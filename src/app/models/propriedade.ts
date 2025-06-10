import { Cliente } from "./cliente";
import { Veiculo } from "./veiculo";

export interface Propriedade {
  id: number;
  dataInicio: string;
  dataTermino: string;
  cliente: Cliente;
  veiculo: Veiculo;
}
