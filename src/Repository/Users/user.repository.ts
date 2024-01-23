import { User, IUser } from "../../Models/Users/user.model";

export default class UserRepository {
  async findUsers(): Promise<IUser[] | null> {
    const users = await User.find();
    return users as any;
  }

  async findOneUser(id: string): Promise<IUser | null> {
    const user: any = await User.findOne({ _id: id })
      .lean()
      .select("+password -isActive -OTP -__v");
    return user as IUser;
  }

  async findUserById(userId: string): Promise<IUser | null> {
    const user: any = await User.findById(userId).select(
      "-password -isEmailVerified -OTP  -displayPictureId"
    );
    return user as IUser;
  }

  async findUserByEmail(userEmail: string): Promise<IUser | null> {
    const result: any = await User.findOne({
      email: userEmail,
    }).exec();
    return result;
  }

  async findUserByIdAndUpdate(
    id: string,
    payload: IUser
  ): Promise<IUser | null> {
    const user: any = await User.findByIdAndUpdate({ _id: id }, payload, {
      new: true,
    })
      .select("-password -OTP -__v")
      .exec();
    return user as IUser;
  }

  async findUserByCodeAndEmail(
    userEmail: string,
    OTP: number | string
  ): Promise<null | IUser> {
    const user: any = await User.findOne({ email: userEmail, OTP }).exec();
    return user as IUser;
  }

  async isVerified(userEmail: string): Promise<IUser | false> {
    const user: any = await this.findUserByEmail(userEmail);
    if (user.isEmailVerified) {
      return user as IUser;
    }
    return false;
  }

  async UpdatePassword(id: string, password: string): Promise<IUser | null> {
    const result: any = await User.findOneAndUpdate({ _id: id }, { password })
      .select("-OTP")
      .exec();
    return result as IUser;
  }

  async deleteUser(userId: string): Promise<IUser> {
    const user: any = await User.findByIdAndDelete({ _id: userId });
    return user as IUser;
  }
}
