import { User, IUser } from "../../Models/Users/user.model";

export default class AuthRepository {
  async signUp(payload: IUser): Promise<IUser> {
    const user: any = await User.create(payload);
    return user as IUser;
  }

  async activateUserAccount(userEmail: string): Promise<IUser> {
    const result: any = await User.findOneAndUpdate(
      { email: userEmail },
      { isEmailVerified: true }
    );
    return result as IUser;
  }

  async resetPassword(
    userEmail: string,
    newPassword: string
  ): Promise<IUser | false> {
    const updateUserPassword: any = await User.findOneAndUpdate(
      { email: userEmail },
      { password: newPassword }
    );
    return updateUserPassword as IUser;
  }

  async UpdateOTP(
    userEmail: string,
    OTP: number,
    otpExpiresAt: number
  ): Promise<IUser | null> {
    const result: any = await User.findOneAndUpdate(
      { email: userEmail },
      { OTP, otpExpiresAt }
    ).exec();
    return result as IUser;
  }
}
