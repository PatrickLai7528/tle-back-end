export default app => {
   const mongoose = app.mongoose;
   const Schema = mongoose.Schema;

   const TraceLinkMatrixSchema = new Schema({
      _id: { type: Schema.Types.ObjectId, auto: true },
      relatedRepoOwnerId: { type: Schema.Types.String, required: true },
      relatedRepoName: { type: Schema.Types.String, required: true },
      links: [
         {
            // id: string;
            // requirementDescription: IRequirementDescription;
            // implement: IImplement;
            // lastUpdateAt?: number;
            _id: { type: Schema.Types.ObjectId, auto: true },
            requirementDescription: [
               {
                  // text: string;
                  // traced: boolean;
                  // lastUpdateAt: number;
                  // id: string;
                  _id: { type: Schema.Types.ObjectId, auto: true },
                  traced: { type: Boolean, default: false },
                  lastUpdateAt: { type: Date, default: Date.now() },
                  text: { type: String, required: true }
               }
            ],
            implement: [
               {
                  // id: string;
                  // type: "METHOD" | "CLASS";
                  // fullyQualifiedName: string;
                  // traced: boolean;
                  _id: { type: Schema.Types.ObjectId, auto: true },
                  type: { type: String, enum: ["METHOD", "CLASS"], default: "CLASS" },
                  fullyQualifiedName: { type: String, required: true },
                  traced: { type: Boolean, default: false }
               }
            ],
            lastUpdateAt: { type: Schema.Types.Data, default: Date.now() },
         }
      ],
      createAt: { type: Schema.Types.Date, default: Date.now() },
      lastUpdateAt: { type: Schema.Types.Date, default: Date.now() },
   });

   return mongoose.model('TraceLinkMatrix', TraceLinkMatrixSchema, 'TraceLinkMatrix');
};
