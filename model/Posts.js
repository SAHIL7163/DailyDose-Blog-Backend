const mongoose = require('mongoose');
const Schema = mongoose.Schema ;


const commentSchema = new Schema(
    {
    
      username: {
        type: String, // Username of the user who made the comment
        required: true,
      },
      content: {
        type: String, // Content of the comment
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now, // Timestamp when the comment was created
      },
    },
    { _id: true } // Enable automatic unique IDs for comments
  );



const postsSchema = new Schema({
    title : {
        type : String ,
        required : true 
    },
    datetime: {
        type : String ,
        required : true
    },
    body : {
        type : String ,
        required : true
    },
    imageUrl :{
        type : String ,
        required : true
    },
    filename :{
        type : String ,
        required : true
    },
    categoryId:{
    type:Number,
    required: true
    } ,
    user : {
        type : String ,
        required : true
    },
    likes: { 
        type: Number,
         default: 0 
    },
    dislikes: { 
        type: Number,
         default: 0 
    },
    usersLiked: { type: [String], default: [] },  // Array to track users who liked
    usersDisliked: { type: [String], default: [] },
    comments: [commentSchema] ,

})

module.exports = mongoose.model('Posts' , postsSchema) ;