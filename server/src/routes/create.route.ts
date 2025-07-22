import { ServerResponse } from "http";
import { Middleware, Route } from "../interfaces/route.js";
import { ApiRequest } from "../interfaces/api-request.interface.js";
import { sendError } from "../middlewares/response.js";

/**
 * createRouter: factory tạo một router handler từ danh sách routes
 * 
 * Matcher logic:
 * - Method matcher: req.method === route.method
 * - Exact path matcher (segment-by-segment)
 * - Param matcher support (':id')
 * - Query string parser
 * - Populate req.params, req.query trước khi call handler
*/
export function createRouter(routes: Route[]) {
      return function (req: ApiRequest, res: ServerResponse) {
            const { url, method } = req;
            const [pathname, query_string] = url ? url.split('?') : [''];

            const pathSegments = pathname.split('/').filter(Boolean);

            const matchedRoute = routes.find(route => {
                  const routeSegments = route.path.split('/').filter(Boolean);

                  if (route.method !== method) return false;
                  if (routeSegments.length !== pathSegments.length) return false;

                  for (let i = 0; i < routeSegments.length; i++) {
                        if (routeSegments[i].startsWith(':')) continue; // param match
                        if (routeSegments[i] !== pathSegments[i]) return false;
                  }

                  return true;
            });

            if (matchedRoute) {
                  const routeSegments = matchedRoute.path.split('/').filter(Boolean);
                  const params: Record<string, string> = {};

                  for (let i = 0; i < routeSegments.length; i++) {
                        if (routeSegments[i].startsWith(':')) {
                              const paramName = routeSegments[i].slice(1);
                              params[paramName] = pathSegments[i];
                        }
                  }
                  req.params = params;

                  const query: Record<string, string> = {};
                  if (query_string) {
                        const searchParams = new URLSearchParams(query_string);
                        for (const [key, value] of searchParams.entries()) {
                              query[key] = value;
                        }
                  }
                  req.query = query;

                  const middlewares = matchedRoute.middlewares || [];
                  runMiddlewareStack(req, res, middlewares, 
                        () => matchedRoute.handler(req, res),
                        (err) => {
                              console.error('Middleware error: ', err);
                              return sendError(res, 400, 'Middleware error');
                        }
                  );
            } else {
                  return sendError(res, 404, `api not found: ${url}`);
            }
      };
}

export const runMiddlewareStack = (req: ApiRequest, res: ServerResponse, middlewares: Middleware[], done: () => void, onError: (err: any) => void) => {
      let index = 0;
      
      const next = (err?: any) => {
            if(err) {
                  onError(err);
                  return;
            }

            const middleware = middlewares[index++];
            if(!middleware) {
                  done();
                  return;
            }

            try {
                  middleware(req, res, next);
            } catch(e) {
                  onError(e);
            }
      };
      
      next();
}