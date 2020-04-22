
export default app => {
   const mongoose = app.mongoose;
   const Schema = mongoose.Schema;

   const RepositorySchema = new Schema({
      _id: { type: Schema.Types.ObjectId, auto: true },
      name: { type: Schema.Types.String, required: true },
      ownerId: { type: Schema.Types.String },
      currentBranch: { type: Schema.Types.String },
      branches: { type: Schema.Types.Mixed },
      trees: { type: Schema.Types.Mixed },
      commits: { type: Schema.Types.Mixed },
      language: { type: Schema.Types.String },
      description: { type: Schema.Types.String },
      lastUpdateAt: { type: Schema.Types.Number },
      shaFileContentMap: { type: Schema.Types.Mixed },
   });

   return mongoose.model('Repository', RepositorySchema, 'Repository');
};
