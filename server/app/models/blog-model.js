const mongoose =require("mongoose")
const {Schema,model}=mongoose

const blogSchema=new Schema({
    title:String,
    content:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        enum:["pending","approved","rejected"],
        default:"pending"
    }
},{timestamps:true})

const Blog=model("Blog",blogSchema)

module.exports=Blog