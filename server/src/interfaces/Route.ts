import { IncomingMessage, ServerResponse } from "http";
import { ApiRequest } from "./api-request.interface";

export interface Middleware {
      (req: ApiRequest, res: ServerResponse, next: (err?: any) => void): void;
}
export interface Route {
      method: string;
      path: string;
      handler: (req: ApiRequest, res: ServerResponse) => void;
      middlewares?: Middleware[];
}