import { Schema } from "mongoose";
export default (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema: Schema = new Schema(
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      githubId: { type: String, default: null },
      createAt: { type: Number, default: Date.now() },
      lastUpdateAt: { type: Number, default: Date.now() },
    },
    {
      timestamps: {
        createdAt: "createAt",
        updatedAt: "lastUpdateAt",
      },
    }
  );

  return mongoose.model("User", UserSchema, "User");
};
