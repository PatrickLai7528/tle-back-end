export default app => {
   const mongoose = app.mongoose;
   const Schema = mongoose.Schema;

   const TreeNodeSchema = new Schema({
      _id: { type: Schema.Types.ObjectId, auto: true },
      sha: { type: String },
      path: { type: String },
      fullyQuailafiedName: { type: String },
      type: { type: String, enum: ["FOLDER", "FILE"] },
   })

   TreeNodeSchema.add({ subTrees: [TreeNodeSchema] })

   const RepositorySchema = new Schema({
      _id: { type: Schema.Types.ObjectId, auto: true },
      name: { type: Schema.Types.String, required: true },
      ownerId: { type: Schema.Types.String },
      currentBranch: { type: Schema.Types.String },
      branches: [
         {
            _id: { type: Schema.Types.ObjectId, auto: true },
            name: { type: String, required: true },
         }
      ],
      trees: [TreeNodeSchema],
      commits: [
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
      language: { type: Schema.Types.String },
      description: { type: Schema.Types.String },
      lastUpdateAt: { type: Number, default: Date.now() },
      shaFileContentMap: { type: Schema.Types.Mixed },
      createAt: { type: Number, default: Date.now() }
   }, {
      timestampes: { createAt: "createAt", updateAt: "lastUpdateAt" }
   });

   return mongoose.model('Repository', RepositorySchema, 'Repository');
};
