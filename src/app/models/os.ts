import { Status } from "./status";
import { Veiculo } from "./veiculo";

export interface OS {
  id: number;
  status: Status;
  dataInicio: string;
  dataFim: string;
  valorTotal: number;
  valorPago: number;
  veiculo: Veiculo;
}
