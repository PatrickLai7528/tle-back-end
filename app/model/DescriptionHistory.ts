export default (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const DescriptionHistorySchema = new Schema(
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      ownerId: { type: Schema.Types.String, required: true },
      requirement: { type: Schema.Types.ObjectId, ref: "Requirement" },
      description: { type: Schema.Types.String, ref: "RequirementDescription" },
      oldDescription: { type: Schema.Types.Mixed },
      newDescription: { type: Schema.Types.Mixed },
      createAt: { type: Number, default: Date.now() },
      lastUpdateAt: { type: Number, default: Date.now() },
    },
    { timestamps: { createdAt: "createAt", updatedAt: "lastUpdateAt" } }
  );

  return mongoose.model(
    "DescriptionHistory",
    DescriptionHistorySchema,
    "DescriptionHistory"
  );
};
