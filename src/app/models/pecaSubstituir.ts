import { OS } from "./os";
import { Peca } from "./peca";

export interface PecaSubstituir {
  id?: number;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal?: number;
  os?: OS;
  peca?: Peca;
}
