export default app => {
   const mongoose = app.mongoose;
   const Schema = mongoose.Schema;

   const TraceLinkMatrixSchema = new Schema({
      _id: { type: Schema.Types.ObjectId, auto: true },
      relatedRepoOwnerId: { type: Schema.Types.String, required: true },
      relatedRepoName: { type: Schema.Types.String, required: true },
      links: [
         {
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
         }
      ],
      createAt: { type: Number, default: Date.now() },
      lastUpdateAt: { type: Number, default: Date.now() },
   }, {
      timestamps: { createAt: "createAt", updateAt: "lastUpdateAt" }
   });

   return mongoose.model('TraceLinkMatrix', TraceLinkMatrixSchema, 'TraceLinkMatrix');
};
