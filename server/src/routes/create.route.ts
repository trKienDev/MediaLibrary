import { ServerResponse } from "http";
import { Route } from "../interfaces/Route.js";
import { ApiRequest } from "../interfaces/api-request.interface.js";

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

                  matchedRoute.handler(req, res);
            } else {
                  res.statusCode = 404;
                  res.setHeader('Content-Type', 'text/plain');
                  res.end('Not Found');
            }
      };
}