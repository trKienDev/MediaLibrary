import { IncomingMessage } from "http";
import { ApiRequest } from "../interfaces/api-request.interface";

const MAX_BODY_SIZE = 1 * 1024 * 1024; // 1MB limit

export const parseJSON = (req: IncomingMessage, requiredFields?: string[]): Promise<any> => {
      return new Promise((resolve, reject) => {
            try {
                  const contentType = req.headers['content-type'] || '';
                  if(!contentType.includes('application/json')) {
                        return reject(new Error('Unsupported Content-Type, expected application/json'));
                  }

                  let body = '';
                  let totalBytes = 0;

                  req.on('data', chunk => {
                        totalBytes += chunk.length;
                        if(totalBytes > MAX_BODY_SIZE) {
                              req.destroy(); // Defensive: stop further processing
                              return reject(new Error('Payload too large (limit 1MB)'));
                        }
                        body += chunk.toString();
                  });

                  req.on('end', () => {
                        try {
                              const parsed = body ? JSON.parse(body) : {};
                              if(requiredFields && requiredFields.length > 0) {
                                    for(const field of requiredFields) {
                                          if(!Object.prototype.hasOwnProperty.call(parsed, field)) {
                                                return reject(new Error(`Missing required field: ${field}`));
                                          }
                                    }
                              }

                              (req as ApiRequest).body = parsed;
                              resolve(parsed);
                        } catch(err: any) {
                              reject(new Error('Invalid JSON: ' + err.message));
                        }
                  });

                  req.on('error', err => {
                        reject(err);
                  });
            } catch(outerError) {
                  reject(new Error('parseJSON unexpected error: ' + outerError));
            }
      });
}