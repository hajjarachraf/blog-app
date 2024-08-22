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
        const newPost=new Post(req.body)
        // console.log(req.body)
        const savedPost=await newPost.save()
        
        res.status(200).json(savedPost)
    }
    catch(err){
        
        res.status(500).json(err)
    }
     
})

//UPDATE
router.put("/:id",verifyToken,async (req,res)=>{
    try{
       
        const updatedPost=await Post.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedPost)

    }
    catch(err){
        res.status(500).json(err)
    }
})


//DELETE
router.delete("/:id",verifyToken,async (req,res)=>{
    try{
        await Post.findByIdAndDelete(req.params.id)
        await Comment.deleteMany({postId:req.params.id})
        res.status(200).json("Post has been deleted!")

    }
    catch(err){
        res.status(500).json(err)
    }
})


//GET POST DETAILS
router.get("/:id",async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        res.status(200).json(post)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//GET POSTS
router.get("/",async (req,res)=>{
    const query=req.query
    
    try{
        const searchFilter={
            title:{$regex:query.search, $options:"i"}
        }
        const posts=await Post.find(query.search?searchFilter:null)
        res.status(200).json(posts)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//GET USER POSTS
router.get("/user/:userId",async (req,res)=>{
    try{
        const posts=await Post.find({userId:req.params.userId})
        res.status(200).json(posts)
    }
    catch(err){
        res.status(500).json(err)
    }
})

// Like a post
router.post("/:id/like", verifyToken, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      const userId = req.userId; // Assuming you have userId in req (from verifyToken middleware)
  
      // Check if the user already liked the post
      if (post.likes.includes(userId)) {
        return res.status(400).json({ message: "You already liked this post" });
      }
  
      // Add user ID to likes array
      post.likes.push(userId);
  
      // Save the updated post
      await post.save();
  
      res.status(200).json({ message: "Post liked successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  // Unlike a post
  router.post("/:id/unlike", verifyToken, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      const userId = req.userId; // Assuming you have userId in req (from verifyToken middleware)
  
      // Check if the user has already liked the post
      const indexOfUser = post.likes.indexOf(userId);
      if (indexOfUser === -1) {
        return res.status(400).json({ message: "You haven't liked this post" });
      }
  
      // Remove user ID from likes array
      post.likes.splice(indexOfUser, 1);
  
      // Save the updated post
      await post.save();
  
      res.status(200).json({ message: "Post unliked successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  });

/* Report a post
router.post("/:id/report", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const userId = req.userId; // Assuming you have userId in req (from verifyToken middleware)

        // Check if the user has already reported the post
        if (post.reports.includes(userId)) {
            return res.status(400).json({ message: "You already reported this post" });
        }

        // Add user ID to reports array
        post.reports.push(userId);

        // Save the updated post
        await post.save();

        res.status(200).json({ message: "Post reported successfully" });
    } catch (err) {
        res.status(500).json(err);
    }
}); */
  // Report a post
  router.post("/:id/report", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const userId = req.userId; // Assuming you have userId in req (from verifyToken middleware)

        // Check if the user has already reported the post
        const alreadyReported = post.reports.some(report => report.user.equals(userId));

        if (alreadyReported) {
            return res.status(400).json({ message: "You already reported this post" });
        }

        // Add new report to the reports array
        const newReport = {
            user: userId,
            message: req.body.message,
            createdAt: new Date()
        };

        post.reports.push(newReport);

        // Save the updated post
        await post.save();

        res.status(200).json({ message: "Post reported successfully", report: newReport });
    } catch (err) {
        res.status(500).json(err);
    }
});


  
module.exports=router