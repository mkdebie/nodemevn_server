module.exports = mongoose => {
    const Tutorial = mongoose.model(
      "tutorial",
      mongoose.Schema(
        {
          guideline: String,
          table: String,
          recommendation: String,
          class: String,
          loe: String,
          published: Boolean,
          prereq: [],
        },
        { timestamps: true }
      )
    );
  
    return Tutorial;
  };
  