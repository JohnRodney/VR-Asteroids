Scores = new Mongo.Collection("scores");

var ScoreSchema = new SimpleSchema({
  score: {
      type: Number,
      optional: true,
      defaultValue: 0
    },
    name: {
      type: String,
      optional: true
    },
});

Scores.attachSchema(ScoreSchema);
