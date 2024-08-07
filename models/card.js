const { Schema, model } = require("mongoose");

const MongooseError = require("../helpers/MongooseError");

const cardSchema = new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      priority: {
        type: String,
        enum: ["without", "low", "medium", "high"],
        default: "without",
      },
      owner: {
        type: Schema.Types.ObjectId,
        ref: "column",
        required: true,
      },
      deadline: {
        type: Date,
      },
    },
    { versionKey: false, timestamps: true }
  );
  
  cardSchema.post("save", MongooseError);
  
  const Card = model("card", cardSchema);
  
  module.exports = Card;
  