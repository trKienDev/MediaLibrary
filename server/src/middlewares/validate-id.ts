import { ServerResponse } from "http"
import { ValidateIdRequest } from "../interfaces/validated-id-request.js"
import { ApiRequest } from "../interfaces/api-request.interface.js";
import { sendError } from "./response.js";

/**
 * validateId:
 * Middleware decorator đảm bảo req.params.id tồn tại + type-safe DX tốt nhất
 */
export const validateId = <TBody = any>(
      handler: (req: ValidateIdRequest<TBody>, res: ServerResponse) => Promise<void> | void
) => {
      return async (req: ApiRequest<TBody>, res: ServerResponse) => {
            const { id } = req.params || {};

            if (!id) {
                  return sendError(res, 400, new Error('Request missing id.'));
            }

            const reqWithId = req as ValidateIdRequest<TBody>;
            reqWithId.params.id = id;

            return handler(reqWithId, res);
      };
};