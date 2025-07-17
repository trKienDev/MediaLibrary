import { IncomingMessage, ServerResponse } from "http";
import { ApiRequest } from "./api-request.interface";

export interface Route {
      method: string;
      path: string;
      handler: (req: ApiRequest, res: ServerResponse) => void;
}