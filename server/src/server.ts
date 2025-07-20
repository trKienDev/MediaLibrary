import http, { IncomingMessage, ServerResponse } from "http";
import mongoose from "mongoose";
import { ApiRequest } from "./interfaces/api-request.interface.js";
import { processRoutes } from "./routes/process.route.js";
import { processStaticFiles } from "./middlewares/process-static-file.js";

// ====== CONFIG ======
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/VideoLibraryDev';

// ====== CORS ======
function setCorsHeaders(res: ServerResponse) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// ====== DATABASE CONNECTION ======
async function connectDB() {
      try {
            await mongoose.connect(MONGODB_URI);
            console.log(`[INFO] Connected to MongoDB at ${MONGODB_URI}`);
      } catch(error) {
            console.error('[ERROR] Failed to connect MongoDB: ', error);
            process.exit(1); // Fail fast nếu connect thất bại
      }
}

// ====== REQUEST HANDLER ======
function requestHandler(req: IncomingMessage, res: ServerResponse) {
      setCorsHeaders(res);

      if(req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
      }

      const isStatic = processStaticFiles(req, res);
      if(isStatic) return;
      
      const apiRequest = req as ApiRequest;
      processRoutes(apiRequest, res);

}

// ====== MAIN FUNCTION ======
async function main() {
      await connectDB();
      
      const server = http.createServer(requestHandler);
      server.listen(PORT, () => {
            console.log(`[INFO] Server listening on http://localhost:${PORT}`);
      });
}

// ====== STARTUP ======
main().catch(err => {
      console.error('[ERROR] Fatal startup error: ', err);
      process.exit(1);
});






