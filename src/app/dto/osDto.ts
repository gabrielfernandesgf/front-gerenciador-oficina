import { Status } from "../models/status";
import { PecaSubstituirDTO } from "./pecaSubstituirDto";
import { ServicoExecutadoDTO } from "./servicoExecutadoDto";

export interface OSDTO {
  status: Status;
  dataInicio: string;
  dataFim: string;
  valorTotal: number;
  valorPago: number;
  placaVeiculo: string;
  pecasSubstituir?: PecaSubstituirDTO[];
  servicosExecutados?: ServicoExecutadoDTO[];
}
