export default (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const TraceLinkSchema = new Schema(
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      requirementDescription: {
        type: Schema.Types.ObjectId,
        ref: "RequirementDescription",
      },
      implement: {
        _id: { type: Schema.Types.ObjectId, auto: true },
        type: { type: String, enum: ["METHOD", "CLASS"], default: "CLASS" },
        fullyQualifiedName: { type: String, required: true },
      },
      lastUpdateAt: { type: Number, default: Date.now() },
      createAt: { type: Number, default: Date.now() },
    },
    { timestamps: { createdAt: "createAt", updatedAt: "lastUpdateAt" } }
  );

  return mongoose.model("TraceLink", TraceLinkSchema, "TraceLink");
};
