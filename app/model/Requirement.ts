export default app => {
   const mongoose = app.mongoose;
   const Schema = mongoose.Schema;

   const RequirementSchema = new Schema({
      _id: { type: Schema.Types.ObjectId, auto: true, alias: "id" },
      relatedRepoOwnerId: { type: Schema.Types.String, required: true },
      relatedRepoName: { type: Schema.Types.String, required: true },
      descriptions: [
         {
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
            specialNeeds: { type: String }
         }
      ],
      lastUpdateAt: { type: Number, default: Date.now() },
      createAt: { type: Number, default: Date.now() }
   }, {
      timestamps: { createAt: "createAt", updateAt: "lastUpdateAt" }
   });

   return mongoose.model('Requirement', RequirementSchema, 'Requirement');
};
