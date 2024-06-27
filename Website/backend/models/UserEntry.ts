import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const Schema = mongoose.Schema;

export interface IUserEntry {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  password: string;
  email: string;
}

const UserEntrySchema = new Schema({
  name: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

UserEntrySchema.methods.generateAccessJWT = function () {
  const payload = {
    id: this._id,
  };
  return jwt.sign(payload, process.env.JWT_SECRET || "", {
    expiresIn: "20m",
  });
};

const UserEntry = mongoose.model("UserEntry", UserEntrySchema);

export default UserEntry;
