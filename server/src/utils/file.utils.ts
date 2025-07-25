import multer, { Multer } from "multer";
import path from "path";
import fs from "fs";
import { ApiRequest } from "../interfaces/api-request.interface.js";

const allowedFileTypes: string[] = [".jpg", ".jpeg", ".png", ".gif", ".mp4"];

const getUploadPath = (folder: string) => {
      return path.join(process.cwd(), "..", "..", "uploads", folder);
};

const ensureUploadPathExists = (uploadPath: string) => {
      if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
      }
};

const createMulterStorage = (uploadPath: string) => {
      return multer.diskStorage({
            destination: (req, file, cb) => {
                  cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                  cb(null, `${Date.now()}-${file.originalname}`);
            },
      });
};

const FileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowedFileTypes.includes(ext)) {
            return cb(new Error(`Only allowed file types: ${allowedFileTypes.join(", ")}`));
      }
      cb(null, true);
};

const handleMulterUpload = (req: ApiRequest, upload: Multer): Promise<void> => {
      return new Promise((resolve, reject) => {
            upload.single("file")(req as any, {} as any, (err: any) => {
                  if (err) {
                        return reject(err);
                  }
                  resolve();
            });
      });
};
const handleMulterUploadArray = (req: ApiRequest, upload: Multer, fieldName: string, maxCount?: number): Promise<void> => {
      return new Promise((resolve, reject) => {
            const uploader = maxCount ? upload.array(fieldName, maxCount) : upload.array(fieldName);
            uploader(req as any, {} as any, (err: any) => { 
                  if (err) {
                        return reject(err);
                  }
                  resolve();
            });
      });
};

/**
 * Hàm UploadFile xử lý việc nhận file upload, đổi tên file và trả về thông tin.
 */
export const uploadFile = async (req: ApiRequest, folder: string): Promise<{ file_name: string }> => {
      try {
            const upload_path = getUploadPath(folder);
            ensureUploadPathExists(upload_path);

            const storage = createMulterStorage(upload_path);
            const upload = multer({ 
                  storage, 
                  fileFilter: FileFilter 
            });
            
            await handleMulterUpload(req, upload);
            
            let file_name = "";
            if ((req as any).file) {
                  const file = (req as any).file as { filename: string };
                  file_name = file.filename;
            }
            
            return { file_name };
      } catch(error) {
            console.error("Error in UploadFile - file.utils.ts: ", error);
            throw error;
      }
};

/**
 * Hàm UploadFiles xử lý việc nhận nhiều file upload từ một trường, đổi tên các file và trả về thông tin.
 * Mặc định trường file là "file".
 */
export const uploadFiles = async ( req: ApiRequest, folder: string, fieldName: string = "file", maxCount?: number): Promise<{ files_name: string[] }> => {
      try {
            const uploadPath = getUploadPath(folder);
            ensureUploadPathExists(uploadPath);
            const storage = createMulterStorage(uploadPath);
            const upload = multer({ storage, fileFilter: FileFilter });

            await handleMulterUploadArray(req, upload, fieldName, maxCount);

            const uploadedFiles_name: string[] = [];
            if ((req as any).files && Array.isArray((req as any).files)) {
                  const files = (req as any).files as Express.Multer.File[];
                  for (const file of files) {
                        uploadedFiles_name.push(file.filename);
                  }
            }

            return { files_name: uploadedFiles_name };
      } catch (error) {
            console.error(`Error in uploadFiles (folder: ${folder}, fieldName: ${fieldName}) - file.utils.ts: `, error);
            throw error;
      }
};
