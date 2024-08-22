const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Post=require('../models/Post')
const Comment=require('../models/Comment')
const verifyToken = require('../verifyToken')

//CREATE
router.post("/create",verifyToken,async (req,res)=>{
    try{
        const newComment=new Comment(req.body)
        const savedComment=await newComment.save()
        res.status(200).json(savedComment)
    }
    catch(err){
        res.status(500).json(err)
    }
     
})

//UPDATE
router.put("/:id",verifyToken,async (req,res)=>{
    try{
       
        const updatedComment=await Comment.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedComment)

    }
    catch(err){
        res.status(500).json(err)
    }
})


//DELETE
router.delete("/:id",verifyToken,async (req,res)=>{
    try{
        await Comment.findByIdAndDelete(req.params.id)
        
        res.status(200).json("Comment has been deleted!")

    }
    catch(err){
        res.status(500).json(err)
    }
})




//GET POST COMMENTS
router.get("/post/:postId",async (req,res)=>{
    try{
        const comments=await Comment.find({postId:req.params.postId})
        res.status(200).json(comments)
    }
    catch(err){
        res.status(500).json(err)
    }
})


router.post("/:id/like", verifyToken, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const userId = req.userId; // Assuming you have userId in req (from verifyToken middleware)

        // Check if the user already liked the comment
        if (comment.likes.includes(userId)) {
            return res.status(400).json({ message: "You already liked this comment" });
        }

        // Add user ID to likes array
        comment.likes.push(userId);

        // Save the updated comment
        await comment.save();

        res.status(200).json({ message: "Comment liked successfully" });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/:id/unlike", verifyToken, async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);
  
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
  
      const userId = req.userId; // Assuming you have userId in req (from verifyToken middleware)
  
      // Check if the user has already liked the comment
      const indexOfUser = comment.likes.indexOf(userId);
      if (indexOfUser === -1) {
        return res.status(400).json({ message: "You haven't liked this comment" });
      }
  
      // Remove user ID from likes array
      comment.likes.splice(indexOfUser, 1);
  
      // Save the updated comment
      await comment.save();
  
      res.status(200).json({ message: "Comment unliked successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports=router