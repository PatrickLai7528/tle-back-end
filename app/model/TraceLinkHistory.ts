export default (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const TraceLinkHistorySchema = new Schema(
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      ownerId: { type: Schema.Types.String, required: true },
      repoName: { type: Schema.Types.String, required: true },
      commit: [
        {
          sha: { type: String, required: true },
        },
      ],
      added: [{ type: Schema.Types.ObjectId, ref: "TraceLink" }],
      removed: [{ type: Schema.Types.ObjectId, ref: "TraceLink" }],
      createAt: { type: Number, default: Date.now() },
      lastUpdateAt: { type: Number, default: Date.now() },
    },
    {
      timestamps: { createdAt: "createAt", updatedAt: "lastUpdateAt" },
    }
  );

  return mongoose.model(
    "TraceLinkHistory",
    TraceLinkHistorySchema,
    "TraceLinkHistory"
  );
};
