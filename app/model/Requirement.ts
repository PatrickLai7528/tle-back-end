export default (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  let RequirementSchema = new Schema(
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      relatedRepoOwnerId: { type: Schema.Types.String, required: true },
      relatedRepoName: { type: Schema.Types.String, required: true },
      descriptions: [
        {
          type: Schema.Types.ObjectId,
          ref: "RequirementDescription",
        },
      ],
      lastUpdateAt: { type: Number, default: Date.now() },
      createAt: { type: Number, default: Date.now() },
    },
    {
      timestamps: { createdAt: "createAt", updatedAt: "lastUpdateAt" },
    }
  );

  return mongoose.model("Requirement", RequirementSchema, "Requirement");
};
