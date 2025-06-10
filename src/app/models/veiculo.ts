import { Modelo } from "./modelo";

export interface Veiculo {
  placa: string;
  chassi: string;
  renavan: string;
  anoFabricacao: number;
  anoModelo: number;
  quilometragem: number;
  identificadorPatrimonio?: string;
  modelo: Modelo;
}
