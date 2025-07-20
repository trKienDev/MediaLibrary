import { ApiRequest } from "../interfaces/api-request.interface.js";

export const extractParamFromRequest = (req: ApiRequest, param: string): string => {
      return (req as any).body[param] || "";
}