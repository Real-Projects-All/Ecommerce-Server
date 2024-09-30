import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "types";

interface IUserModal extends Model<IUser> {
  findOneOrCreateFromGoogle(profile: any): Promise<IUser>;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  role: { type: Number, default: 0 },
});

userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return this.password === enteredPassword;
};

userSchema.statics.findOneOrCreateFromGoogle = async function (profile: any) {
  const { id, emails, displayName } = profile;

  let user =
    (await this.findOne({ googleId: id })) ||
    (await this.findOne({ email: emails[0].value }));

  if (!user) {
    user = new this({
      googleId: id,
      email: emails[0].value,
      name: displayName,
    });

    console.log("user", user);

    await user.save();
  }

  return user;
};

const User = mongoose.model<IUser, IUserModal>("User", userSchema);
export default User;
