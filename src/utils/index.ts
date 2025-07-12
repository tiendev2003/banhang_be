 import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';
import emailService from '../services/email.service';

dotenv.config();

// Tạo JWT token
export const generateToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '30d',
    }
  );
};

// Xử lý các lỗi API và trả về định dạng chuẩn
export class ApiError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    
    // Capture đúng stack trace để định vị lỗi
    Error.captureStackTrace(this, this.constructor);
  }
}

// Hàm tiện ích để catch các lỗi async trong Express
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Hàm để trả về response chuẩn
export const sendResponse = (
  res: Response,
  statusCode: number,
  status: 'success' | 'error' | 'fail',
  message: string,
  data?: any,
  pagination?: {
    page: number;
    totalPages: number;
    totalItems: number;
  }
) => {
  return res.status(statusCode).json({
    status,
    message,
    data: data || [],
    pagination
  });
};

// Hàm trả về response thành công
export const sendSuccessResponse = (
  res: Response,
  message: string = 'Operation successful',
  data: any = [],
  statusCode: number = 200,
  pagination?: {
    page: number;
    totalPages: number;
    totalItems: number;
  }
) => {
  return sendResponse(res, statusCode, 'success', message, data, pagination);
};

// Hàm trả về response thất bại
export const sendErrorResponse = (
  res: Response,
  message: string = 'An error occurred',
  statusCode: number = 500
) => {
  return sendResponse(res, statusCode, 'error', message);
};

// Interface cho thông tin email
export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  context?: Record<string, any>;
}

// Hàm gửi email
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    console.log('Gửi email...');
    console.log('Đến:', options.to);
    console.log('Chủ đề:', options.subject);
    
    if (options.template && options.context) {
      // Sử dụng template
      console.log('Sử dụng template:', options.template);
      await emailService.sendOrderEmail(
        options.to,
        options.subject,
        options.template,
        options.context
      );
    } else {
      // Sử dụng text/html đơn giản
      console.log('Nội dung:', options.text);
      await emailService.sendOrderEmail(
        options.to,
        options.subject,
        'sendOtpEmail', // Template mặc định
        { otp: options.text }
      );
    }
     
    return true;
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    return false;
  }
};

// Export from slug.util.ts
export * from './slug.util';

