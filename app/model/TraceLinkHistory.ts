export default app => {
   const mongoose = app.mongoose;
   const Schema = mongoose.Schema;

   const TraceLinkSchema = new Schema({
      _id: { type: Schema.Types.ObjectId, auto: true },
      requirementDescription: [
         {
            _id: { type: Schema.Types.ObjectId, auto: true },
            traced: { type: Boolean, default: false },
            lastUpdateAt: { type: Number, default: Date.now() },
            text: { type: String, required: true }
         }
      ],
      implement: [
         {
            _id: { type: Schema.Types.ObjectId, auto: true },
            type: { type: String, enum: ["METHOD", "CLASS"], default: "CLASS" },
            fullyQualifiedName: { type: String, required: true },
            traced: { type: Boolean, default: false },
            lastUpdateAt: { type: Number, default: Date.now() }
         }
      ],
      lastUpdateAt: { type: Number, default: Date.now() },
   })

   const TraceLinkHistorySchema = new Schema({
      _id: { type: Schema.Types.ObjectId, auto: true },
      ownerId: { type: Schema.Types.String, required: true },
      repoName: { type: Schema.Types.String, required: true },
      commit: [
         {
            _id: { type: Schema.Types.ObjectId, auto: true },
            sha: { type: String },
            changedFiles: [
               {
                  _id: { type: Schema.Types.Objected, auto: true },
                  sha: { type: String },
                  filename: { type: String },
                  status: { type: String },
                  additions: { type: Number },
                  deletions: { type: Number },
                  path: { type: String },
                  rawContent: { type: String }
               }
            ]
         }
      ],
      added: [TraceLinkSchema],
      removed: [TraceLinkSchema],
      createAt: { type: Number, default: Date.now() },
      lastUpdateAt: { type: Number, default: Date.now() }
   }, {
      timestamps: { createAt: "createAt", updateAt: "lastUpdateAt" }
   });

   return mongoose.model('TraceLinkHistory', TraceLinkHistorySchema, 'TraceLinkHistory');
};
