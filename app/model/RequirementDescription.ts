export default (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const RequirementDescriptionSchema = new Schema(
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      name: { type: String, required: true },
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
      specialNeeds: { type: String },
    },
    {
      timestamps: { createAt: "createAt", updateAt: "lastUpdateAt" },
    }
  );

  return mongoose.model(
    "RequirementDescription",
    RequirementDescriptionSchema,
    "RequirementDescription"
  );
};
