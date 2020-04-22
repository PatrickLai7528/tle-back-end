export default app => {
   const mongoose = app.mongoose;
   const Schema = mongoose.Schema;

   const TraceLinkHistorySchema = new Schema({
      _id: { type: Schema.Types.ObjectId, auto: true },
      ownerId: { type: Schema.Types.String, required: true },
      repoName: { type: Schema.Types.String, required: true },
      commit: { type: Schema.Types.Mixed, required: true },
      added: { type: Schema.Types.Mixed },
      removed: { type: Schema.Types.Mixed }
   });

   return mongoose.model('TraceLinkHistory', TraceLinkHistorySchema, 'TraceLinkHistory');
};
