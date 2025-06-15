import { Modelo } from "./modelo";
import {VeiculoAcessorio} from './veiculoAcessorio';

export interface Veiculo {
  placa: string;
  chassi: string;
  renavan: string;
  anoFabricacao: number;
  anoModelo: number;
  quilometragem: number;
  identificadorPatrimonio?: string;
  modelo: Modelo;
  veiculoAcessorios: VeiculoAcessorio[];
}
