import { EventEmitter } from 'node:events';
import { sendConfirmEmail } from '../email/send.email';

export const emailEvent = new EventEmitter();

emailEvent.on(
  'sendOtp',
  async (email: string, otp: string, subject: string, title: string) => {
    await sendConfirmEmail(email, otp, subject, title);
  },
);
