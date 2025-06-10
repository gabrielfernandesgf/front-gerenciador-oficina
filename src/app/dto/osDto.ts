import { Status } from "../models/status";

export interface OSDTO {
  status: Status;
  dataInicio: string;
  dataFim: string;
  valorTotal: number;
  valorPago: number;
  placaVeiculo: string;
}
