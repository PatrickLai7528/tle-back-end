import { Schema } from 'mongoose';

export default app => {
   const mongoose = app.mongoose;
   const Schema = mongoose.Schema;

   const SaltTableSchema: Schema = new Schema(
      {
         email: { type: String, required: true, unique: true },
         salt: { type: String, required: true }
      },
   );

   return mongoose.model("SaltTable", SaltTableSchema, "SaltTable");
}