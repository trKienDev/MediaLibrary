import { ServerResponse } from "http";
import { Route } from "../interfaces/Route.js";
import { processApiRoutes } from "./api.route.js";
import { ApiRequest } from "../interfaces/api-request.interface.js";

// Declarative router map
const routerMap: { prefix: string, handler: (req: ApiRequest, res: ServerResponse) => void}[] = [
      { prefix: '/api/', handler: processApiRoutes },
];

export function processRoutes(req: ApiRequest, res: ServerResponse) {
      const url = req.url || '';
      for(const route of routerMap) {
            if(url.startsWith(route.prefix)) {
                  route.handler(req, res);
                  return;
            }
      }

      console.error("Error handleRoutes in route.ts");
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Route nor found');
}

