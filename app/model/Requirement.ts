export default app => {
   const mongoose = app.mongoose;
   const Schema = mongoose.Schema;

   const RequirementSchema = new Schema({
      _id: { type: Schema.Types.ObjectId, auto: true, alias: "id" },
      relatedRepoOwnerId: { type: Schema.Types.String, required: true },
      relatedRepoName: { type: Schema.Types.String, required: true },
      descriptions: [
         {
            _id: { type: Schema.Types.ObjectId, auto: true },
            text: { type: String, required: true },
            traced: { type: Boolean, default: false },
            lastUpdateAt: { type: Date, default: Date.now() }
         }
      ],
      lastUpdateAt: { type: Schema.Types.Date, default: Date.now() },
      createAt: { type: Schema.Types.Date, default: Date.now() }
   }, {
      timestamps: { createAt: "createAt", updateAt: "lastUpdateAt" }
   });

   return mongoose.model('Requirement', RequirementSchema, 'Requirement');
};
