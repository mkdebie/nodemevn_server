module.exports = (mongoose, mongoosePaginate) => {
  var schema = mongoose.Schema(
    {
      guideline: String,
      table: String,
      recommendation: String,
      class: String,
      loe: String,
      published: Boolean,
      prereq: [],
      supportOf: [],
    },
    { timestamps: true }
  );
      
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object._id = _id;
    return object;
  });

  schema.plugin(mongoosePaginate);

  const Tutorial = mongoose.model("tutorial", schema)
  return Tutorial;
  };
  