import {CustomerRespDTO} from '../CustomerUtils/Utils/customer-resp-dto';

export interface AppResponse {
  message: string;
  statusCode: number;
  customers: CustomerRespDTO[];
  customerToGet: CustomerRespDTO;
}
