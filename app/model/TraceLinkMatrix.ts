export default (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const TraceLinkMatrixSchema = new Schema(
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      relatedRepoOwnerId: { type: Schema.Types.String, required: true },
      relatedRepoName: { type: Schema.Types.String, required: true },
      links: [
        {
          requirementDescription: {
            name: { type: String, required: true },
            traced: { type: Boolean, default: false },
            lastUpdateAt: { type: Number, default: Date.now() },
            createBy: { type: String },
            createAt: { type: Number, default: Date.now() },
            lastUpdateBy: { type: String },
            participants: { type: String },
            triggeringCondition: { type: String },
            preCondition: { type: String },
            postCondition: { type: String },
            priority: { type: String },
            normalProcess: { type: String },
            expansionProcess: { type: String },
            specialNeeds: { type: String },
          },
          implement: {
            type: { type: String, enum: ["METHOD", "CLASS"], default: "CLASS" },
            fullyQualifiedName: { type: String, required: true },
            traced: { type: Boolean, default: false },
            lastUpdateAt: { type: Number, default: Date.now() },
          },
          lastUpdateAt: { type: Number, default: Date.now() },
        },
      ],
      createAt: { type: Number, default: Date.now() },
      lastUpdateAt: { type: Number, default: Date.now() },
    },
    {
      timestamps: { createAt: "createAt", updateAt: "lastUpdateAt" },
    }
  );

  return mongoose.model(
    "TraceLinkMatrix",
    TraceLinkMatrixSchema,
    "TraceLinkMatrix"
  );
};
