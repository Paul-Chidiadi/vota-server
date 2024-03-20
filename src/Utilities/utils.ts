import bcrypt from "bcrypt";
import "dotenv/config";
import { convert } from "html-to-text";
import path from "path";
import fs from "fs";
import multer from "multer";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose, { ObjectId } from "mongoose";
import UserRepository from "../Repository/Users/user.repository";
import cron from "node-cron";
import { Event, IEvent } from "../Models/Events/events.model";
import EventRepository from "../Repository/Events/events.repository";
import NotificationRepository from "../Repository/Notification/notification.repository";
import { INotification } from "../Models/Notification/notification.model";
// import CryptoJS from "crypto-js";
// import { v2 as cloudinary } from 'cloudinary';
// import { customAlphabet } from 'nanoid';

const userRepository = new UserRepository();
const eventsRepository = new EventRepository();
const notificationRepository = new NotificationRepository();

export default class Utilities {
  private pepper = String(process.env.BCRYPT_PASSWORD);

  private saltRound = Number(process.env.SALT_ROUNDS);

  private accessToken = process.env.ACCESSTOKENSECRET as string;

  public async verifyJWT(token: string) {
    try {
      return {
        payload: jwt.verify(token, this.accessToken),
        expired: false,
      };
    } catch (error) {
      if ((error as Error).name === "TokenExpiredError") {
        return { payload: jwt.decode(token), expired: true };
      }
      throw error;
    }
  }

  public async updateEventStatus() {
    // Define a cron job to run at 12 AM every day
    cron.schedule("0 0 * * *", async () => {
      try {
        // Get the current date
        const currentDate = new Date();
        // Set the time to the beginning of the day (00:00:00)
        currentDate.setUTCHours(0, 0, 0, 0);

        // Get the end of the day (23:59:59)
        const endOfDay = new Date(currentDate);
        endOfDay.setUTCHours(23, 59, 59, 999);

        // Find events occurring on the current date
        const events = await Event.find({
          // Match events whose dateTime falls within the current day
          schedule: {
            $gte: currentDate.toISOString(), // Greater than or equal to the start of the day
            $lte: endOfDay.toISOString(), // Less than or equal to the end of the day
          },
          status: { $ne: "ongoing" }, // Exclude events already marked as ongoing
        });

        // Update the status of ongoing events
        for (const event of events) {
          const eventData: any = await Event.findByIdAndUpdate(
            { _id: event._id },
            { status: "ongoing" },
            {
              new: true,
            }
          ).exec();

          if (eventData) {
            //If status has been updated then update on firebase, create and insert notifications for both mongoDb and firebase
            const result = await eventsRepository.firebaseUpdateEvent(eventData._id, eventData);
            const notificationPayload: INotification = {
              senderId: eventData.owner,
              notificationType: "Event Started",
              notificationMessage: "Has an event starting today",
            };
            const notificationData = await notificationRepository.createNotification(
              notificationPayload
            );
            if (notificationData) {
              // FIREBASE REALTIME DATABASE PUSH NOTIFICATION
              const result = await notificationRepository.firebaseInsertNotification(
                notificationData
              );
            }
          }
        }
      } catch (error) {
        throw error;
      }
    });
  }

  public async generateHash(plainPassword: string): Promise<string> {
    const hash = await bcrypt.hash(plainPassword + this.pepper, this.saltRound);
    return hash;
  }

  isValidMongoId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
  }

  convertIdToMongoId(id: string): ObjectId {
    const objectId: any = new mongoose.Types.ObjectId(id);
    return objectId;
  }

  generateRandomCode = (size = 8, alpha = true): number | string => {
    const characters = alpha ? "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-" : "0123456789";
    const chars = characters.split("");
    let selections = "";
    for (let i = 0; i < size; i += 1) {
      const index = Math.floor(Math.random() * chars.length);
      selections += chars[index];
      chars.splice(index, 1);
    }
    return selections;
  };

  async generateOtpCode() {
    const OTP = this.generateRandomCode(6, false) as number;
    return {
      OTP,
      otpExpiresAt: Date.now() + 10 * 60 * 1000,
    };
  }

  abbreviateOrganisation(organisation: string) {
    const words = organisation.split(" ");
    const abbreviation = words.map((word) => word.charAt(0)).join("");
    return abbreviation.toUpperCase();
  }

  async convertEmailToText(html: string) {
    const result = convert(html, {
      wordwrap: 150,
    });
    return result;
  }

  async comparePassword(password: string, hashPassword: string): Promise<boolean> {
    const result = await bcrypt.compare(password + this.pepper, hashPassword);
    return result;
  }

  async generateToken(email: string) {
    const accessTokenSecret = process.env.ACCESSTOKENSECRET as string;
    const refreshTokenSecret = process.env.REFRESHTOKENSECRET as string;
    const payload: any = await userRepository.findUserByEmail(email);
    const data = {
      id: payload._id,
      role: payload.role,
      email: payload.email,
    };
    const accessToken = jwt.sign(data, accessTokenSecret, {
      expiresIn: "1800s",
    });
    const refreshToken = jwt.sign(data, refreshTokenSecret, {
      expiresIn: "1d",
    });
    return Promise.resolve({ accessToken, refreshToken });
  }

  // verify refresh token
  async verifyToken(email: string, token: string) {
    try {
      const decoded: JwtPayload = jwt.decode(token) as JwtPayload;
      const expirationTime = decoded.exp as number;
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime > expirationTime || decoded.email !== email) {
        // token has expired
        return false;
      }
      // token is still valid
      return true;
    } catch (error) {
      return false;
    }
  }

  async decodeJwtToken(token: string) {
    const decoded = jwt.decode(token) as JwtPayload;
    return decoded;
  }

  Date() {
    const currentdate = new Date();
    const datetime = `Last Sync: ${currentdate.getDate()}/${
      currentdate.getMonth() + 1
    }/${currentdate.getFullYear()} @ ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`;
    return datetime;
  }
}

// create folder to store images/files
export const fileStorageEngine = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const dir = `${path.normalize(path.join(__dirname, "../images"))}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },

  filename: (req: any, file: any, cb: any) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

// check file/images
export const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb({ message: `Unsupported file format ${file.mimetype}` });
  }
};

export const upload = multer({
  storage: fileStorageEngine,
  limits: { fileSize: 5242880 },
  fileFilter,
});

export const statusCode = {
  ok() {
    return 200;
  },

  created() {
    return 201;
  },

  accepted() {
    return 202;
  },

  noContent() {
    return 204;
  },

  resetContent() {
    return 205;
  },

  partialContent() {
    return 206;
  },

  badRequest() {
    return 400;
  },

  unauthorized() {
    return 401;
  },

  paymentRequired() {
    return 402;
  },

  accessForbidden() {
    return 403;
  },

  notFound() {
    return 404;
  },

  methodNotAllowed() {
    return 405;
  },

  notAccepted() {
    return 406;
  },

  proxyAuthenticationRequired() {
    return 407;
  },

  requestTimeout() {
    return 408;
  },

  conflict() {
    return 409;
  },

  unprocessableEntity() {
    return 422;
  },

  internalServerError() {
    return 500;
  },

  notImplemented() {
    return 501;
  },

  badGateway() {
    return 502;
  },

  serviceUnavalaibleError() {
    return 503;
  },

  gatewayTimeout() {
    return 504;
  },
};
