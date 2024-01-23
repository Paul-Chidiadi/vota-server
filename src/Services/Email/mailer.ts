import dotenv from "dotenv";
import nodemailer from "nodemailer";
import cron from "cron";
import Utility from "../../Utilities/utils";
import UserRepository from "../../Repository/Users/user.repository";

const userRepository = new UserRepository();

dotenv.config({ path: ".env" });

const util = new Utility();

export interface Mail {
  email: string;
  firstName?: string;
  otp?: number | string;
  subject: string;
}

export class MalierService {
  private emailFrom = process.env.EMAIL_FROM;

  private GMAIL_HOST = process.env.GMAIL_HOST;

  private GMAIL_USERNAME = process.env.GMAIL_USERNAME;

  private GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;

  private SERVICE_NAME = process.env.SERVICE_NAME;

  private GMAIL_PORT = process.env.GMAIL_PORT;

  private baseUrl = process.env.BASE_URL;

  async sendMail(options: Mail, template: string): Promise<any> {
    const text = await util.convertEmailToText(template);
    const msg: any = {
      to: options.email,
      from: this.emailFrom, // Use the email address or domain you verified above
      subject: options.subject,
      text,
      html: template,
    };
    if (process.env.NODE_ENV === "production") {
      const transporter = nodemailer.createTransport({
        service: this.SERVICE_NAME,
        host: this.GMAIL_HOST,
        port: Number(this.GMAIL_PORT),
        auth: {
          user: this.GMAIL_USERNAME,
          pass: this.GMAIL_PASSWORD,
        },
      });
      // send the email with nodemailer
      const result = await transporter.sendMail(msg);
      return result;
    }
    const transporter = nodemailer.createTransport({
      service: this.SERVICE_NAME,
      host: this.GMAIL_HOST,
      port: Number(this.GMAIL_PORT),
      auth: {
        user: this.GMAIL_USERNAME,
        pass: this.GMAIL_PASSWORD,
      },
    });
    // send the email with nodemailer
    const result = await transporter.sendMail(msg);
    return result;
  }

  async sendOTP(options: Mail) {
    if (options.otp !== undefined && options.otp.toString().length === 6) {
      const message = `<p>Hello,</p>
      <p>Welcome to VOTA. Please verify your 
      email address with the OTP code below. It would expire after 10mins.<p>
      <p>OTP: <b>${options.otp}</b></p>`;
      const result = await this.sendMail(options, message);
      return result;
    }
  }

  async accountActivationMail(options: Mail) {
    const message = `<p>Welcome to VOTA,
    your account have been activated. Kindly login to continue<p>`;
    const result = await this.sendMail(options, message);
    return result;
  }

  async forgotPasswordMail(options: Mail) {
    if (options.otp !== undefined && options.otp.toString().length === 6) {
      const message = `<p>Hi, <br> 
        <p>We received a request to reset your password, to reset your password use the code below and follow the instructions.<br> 
        <b>Code: ${options.otp}</b><br>

       <p>If you didn't request this, please ignore this email.
        </p>
        Thanks,  <br> 
        Team VOTA <p/>`;
      const result = await this.sendMail(options, message);
      return result;
    }
  }

  async resetPasswordMail(options: Mail) {
    const message = `<p>
    Hi, <br> 
    You have successfully reset your password.
      <br> 
    Team VOTA <p/>`;
    const result = await this.sendMail(options, message);
    return result;
  }
}
