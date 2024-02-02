import { User, IUser } from "../../Models/Users/user.model";

export default class UserRepository {
  async findUsers(): Promise<IUser[] | null> {
    const users = await User.find();
    return users as any;
  }

  async findUsersByRole(role: string): Promise<IUser[] | null> {
    const users = await User.find({ role: role });
    return users as any;
  }

  async findOneUser(id: string): Promise<IUser | null> {
    const user: any = await User.findOne({ _id: id })
      .lean()
      .select("-OTP -__v");
    return user as IUser;
  }

  async findUserById(userId: string): Promise<IUser | null> {
    const user: any = await User.findById(userId)
      .select("-password -isEmailVerified")
      .populate("members")
      .populate("organizations");
    return user as IUser;
  }

  async findUserByEmail(userEmail: string): Promise<IUser | null> {
    const result: any = await User.findOne({
      email: userEmail,
    })
      .select("+password")
      .exec();
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

  async removeMember(userId: string, memberId: string): Promise<IUser> {
    const user: any = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { members: memberId } },
      { new: true }
    );
    return user as IUser;
  }

  async addMember(userId: string, memberId: string): Promise<IUser> {
    const user: any = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { members: memberId } },
      { new: true }
    );
    return user as IUser;
  }

  async removeOrganization(
    userId: string,
    organizationId: string
  ): Promise<IUser> {
    const user: any = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { organizations: organizationId } },
      { new: true }
    );
    return user as IUser;
  }

  async addOrganization(
    userId: string,
    organizationId: string
  ): Promise<IUser> {
    const user: any = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { organizations: organizationId } },
      { new: true }
    );
    return user as IUser;
  }
}
