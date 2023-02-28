import { Document, model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
/**
 * Type to model the User Schema for TypeScript.
 * @param email:string
 * @param password:string
 * @param avatar:string
 */

export type TUser = {
  email: string;
  password: string;
  avatar?: string;
};

/**
 * Mongoose Document based on TUser for TypeScript.
 * https://mongoosejs.com/docs/documents.html
 *
 * TUser
 * @param email:string
 * @param password:string
 * @param avatar:string
 */

export interface IUser extends TUser, Document {
  getSignedJwtToken(): string;
  comparePassword(str: string): boolean;
}

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

/**
 * Mongoose Model based on TUser for TypeScript.
 * https://mongoosejs.com/docs/models.html
 *
 * TUser
 * @param email:string
 * @param password:string
 * @param avatar:string
 */

userSchema.pre('save', async function (next) {
  if (this.password) {
    let salt = 10;
    let hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  }
  return next();
});

userSchema.methods.comparePassword = async function validatePassword(
  data: any
) {
  if (this.password) {
    return bcrypt.compare(data, this.password);
  }
};

userSchema.methods.getSignedJwtToken = async function () {
  if (process.env.JWT_SECRET) {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
  }
};

const User = model<IUser>('User', userSchema);

export default User;
