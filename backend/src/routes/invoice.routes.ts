import { Router } from 'express';
import multer from 'multer';
import { env } from '../config/env.js';
import { extractInvoice } from '../controllers/invoice.controller.js';
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024 } });
export const invoiceRouter = Router();
invoiceRouter.post('/extract', upload.single('file'), extractInvoice);
