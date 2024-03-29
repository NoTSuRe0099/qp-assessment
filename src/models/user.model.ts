import mongoose, { Document } from 'mongoose';
export enum userRoles {
  user = 'user',
  admin = 'admin',
}
interface IUser extends Document {
  email: string;
  password: string;
  role: userRoles;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      required: true,
      default: 'user',
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
