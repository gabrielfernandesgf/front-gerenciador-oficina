import { Acessorio } from "./acessorio";
import { Veiculo } from "./veiculo";

export interface VeiculoAcessorio {
  id: number;
  veiculo?: Veiculo;
  acessorio: Acessorio;
}
