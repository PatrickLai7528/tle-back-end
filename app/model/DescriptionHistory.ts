import { RequirementDescriptionSchema } from "../utils/Schema";

export default (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const DescriptionHistorySchema = new Schema(
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      ownerId: { type: Schema.Types.String, required: true },
      requirementId: { type: Schema.Types.String, required: true },
      oldDescription: { type: RequirementDescriptionSchema(Schema) },
      newDescription: { type: RequirementDescriptionSchema(Schema) },
      createAt: { type: Number, default: Date.now() },
      lastUpdateAt: { type: Number, default: Date.now() },
    },
    { timestamps: { createAt: "createAt", updateAt: "lastUpdateAt" } }
  );

  return mongoose.model(
    "DescriptionHistory",
    DescriptionHistorySchema,
    "DescriptionHistory"
  );
};
