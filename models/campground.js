var mongoose = require("mongoose");

//SCHEMA SET UP START
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
   });

//deteting the comments when deleting a camground
   const Comment = require("./comment");
campgroundSchema.pre("remove", async function(){
    await Comment.deleteMany ({
        _id: {
            $in: this.comments
        }
    });
});

   
   module.exports = mongoose.model("Campground", campgroundSchema);
   