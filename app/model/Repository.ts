export default app => {
   const mongoose = app.mongoose;
   const Schema = mongoose.Schema;

   const TreeNodeSchema = new Schema({
      sha: { type: String },
      path: { type: String },
      fullyQuailafiedName: { type: String },
      type: { type: String, enum: ["FOLDER", "FILE"] },
   })

   TreeNodeSchema.add({ subTrees: [TreeNodeSchema] })

   const RepositorySchema = new Schema({
      name: { type: Schema.Types.String, required: true },
      ownerId: { type: Schema.Types.String },
      currentBranch: { type: Schema.Types.String },
      branches: [
         {
            name: { type: String, required: true },
         }
      ],
      trees: [TreeNodeSchema],
      commits: [
         {
            message: { type: String },
            committer: { id: { type: String } },
            committedAt: { type: Number },
            author: { id: { type: String } },
            parents: {
               sha: {
                  type: String
               }
            },
            stats: {
               total: { type: Number },
               additions: { type: Number },
               deletions: { type: Number }
            },
            sha: { type: String },
            changedFiles: [
               {
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
