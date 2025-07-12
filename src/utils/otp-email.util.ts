import { sendEmail } from '../utils';

interface SendOtpEmailOptions {
  to: string;
  username: string;
  otp: string;
  reason?: string;
  expiryMinutes?: number;
  template?: 'sendOtpEmail' | 'sendOtpEmail-simple' | 'resetPasswordEmail';
  supportEmail?: string;
  supportPhone?: string;
  website?: string;
}

/**
 * Gửi email OTP với template đẹp
 */
export const sendOtpEmail = async (options: SendOtpEmailOptions): Promise<boolean> => {
  const {
    to,
    username,
    otp,
    reason = 'xác thực tài khoản',
    expiryMinutes = 5,
    template = 'sendOtpEmail',
    supportEmail = 'support@cuahang.com',
    supportPhone = '1900-1234',
    website = 'https://cuahang.com'
  } = options;

  try {
    await sendEmail({
      to,
      subject: `Mã xác thực OTP - ${reason}`,
      template,
      context: {
        name: username,
        otp,
        reason,
        expiryMinutes,
        supportEmail,
        supportPhone,
        website,
        currentYear: new Date().getFullYear(),
        sendTime: new Date(),
      },
    });

    return true;
  } catch (error) {
    console.error('Lỗi khi gửi OTP email:', error);
    return false;
  }
};

/**
 * Gửi email OTP đơn giản (chỉ text)
 */
export const sendOtpEmailSimple = async (
  to: string,
  otp: string,
  expiryMinutes: number = 5
): Promise<boolean> => {
  try {
    await sendEmail({
      to,
      subject: 'Mã xác thực OTP',
      text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong ${expiryMinutes} phút.`,
    });

    return true;
  } catch (error) {
    console.error('Lỗi khi gửi OTP email đơn giản:', error);
    return false;
  }
};

/**
 * Gửi email OTP cho đặt lại mật khẩu
 */
export const sendResetPasswordOtp = async (
  to: string,
  username: string,
  otp: string,
  expiryMinutes: number = 5
): Promise<boolean> => {
  return sendOtpEmail({
    to,
    username,
    otp,
    reason: 'đặt lại mật khẩu',
    expiryMinutes,
    template: 'resetPasswordEmail',
  });
};

/**
 * Gửi email OTP cho xác thực tài khoản
 */
export const sendAccountVerificationOtp = async (
  to: string,
  username: string,
  otp: string,
  expiryMinutes: number = 5
): Promise<boolean> => {
  return sendOtpEmail({
    to,
    username,
    otp,
    reason: 'xác thực tài khoản',
    expiryMinutes,
    template: 'sendOtpEmail',
  });
};
