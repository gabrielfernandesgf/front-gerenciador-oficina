import { Marca } from "./marca";

export interface Modelo {
  id: number;
  nome: string;
  descricao: string;
  marca: Marca;
}
