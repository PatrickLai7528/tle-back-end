export default (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const TraceLinkMatrixSchema = new Schema(
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      relatedRepoOwnerId: { type: Schema.Types.String, required: true },
      relatedRepo: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Repository",
      },
      links: [{ type: Schema.Types.ObjectId, ref: "TraceLink" }],
      createAt: { type: Number, default: Date.now() },
      lastUpdateAt: { type: Number, default: Date.now() },
    },
    {
      timestamps: { createdAt: "createAt", updatedAt: "lastUpdateAt" },
    }
  );

  return mongoose.model(
    "TraceLinkMatrix",
    TraceLinkMatrixSchema,
    "TraceLinkMatrix"
  );
};
