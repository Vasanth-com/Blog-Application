const Post = require('../models/postmodel');
const User = require('../models/usermodel');
const HttpError = require('../models/errorModel');
const path = require('path')
const fs = require('fs');
const {v4: uuid} = require('uuid')



//========================create post
// POST: api/posts
//protected

const createPost = async(req,res,next) =>{
    try {
        let {title,category,description} = req.body;
        
        if(!title || !category || !description || !req.files){
            return next(new HttpError("Fill in all fields and choose thumbnail.",422));
        }
        const{thumbnail} = req.files;
        // check the file size 
        if(thumbnail.size > 2000000){
            return next(new HttpError("Thumbnail too big. File should be less than 2kb"))
        }
        let fileName = thumbnail.name;
        let splittedFileName = fileName.split('.')
        let newFileName = splittedFileName[0]+ uuid() + "." + splittedFileName[splittedFileName.length - 1]
        thumbnail.mv(path.join(__dirname , "..",'/uploads',newFileName),async(err)=>{
            if(err){
                return next(new HttpError(err));
            }else{
                const newPost = await Post.create({title,category,description,thumbnail:newFileName,creator:req.user.id})
                if(!newPost){
                    return next(new HttpError("Post could't be created",422))
                }
                // find user and increate post count by 1
                const currentUser = await User.findById(req.user.id);
                const userPostCount = currentUser.posts +1;
                await User.findByIdAndUpdate(req.user.id,{posts:userPostCount})

                res.status(201).json(newPost)
            }
        })
    } catch (error) {
        return next(new HttpError(error));
    }
}
//========================get all posts
// GET: api/posts
//unprotected

const getPosts = async(req,res,next) =>{
    try {
        const posts = await Post.find().sort({updatedAt: -1})
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error))
    }
}
//========================get single post
// GET: api/posts/:id
//unprotected

const getPost = async(req,res,next) =>{
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post){
            return next(new HttpError("Post not found",422));
        }
        res.status(200).json(post)
    } catch (error) {
        return next(new HttpError(error))
    }
}
//========================get posts by category
// GET: api/posts/categories/:category
//unprotected

const getCatPosts = async(req,res,next) =>{
    try {
        const {category} = req.params;
        const catPosts = await Post.find({category}).sort({createdAt: -1});
        res.status(200).json(catPosts)
    } catch (error) {
        return next(new HttpError(error))
    }
}
//========================get single post
// GET: api/posts/users/:id
//unprotected

const getUserPosts = async(req,res,next) =>{
    try {
        const{id} = req.params;
        const posts = await Post.find({creator: id}).sort({createdAt: -1});
        res.status(200).json(posts) 
    } catch (error) {
        return next(new HttpError(error))
    }
}
//======================== edit post
// PATCH: api/posts/:id
//protected

const editPosts = async(req,res,next) =>{
    try {
        let fileName;
        let newFileName;
        let updatedPost;
        const postId = req.params.id;
        let {title,category,description} = req.body;

        if(!title || !category || description.length < 12){
            return next(new HttpError("Fill in all fields",422));
        }
        const oldPost = await Post.findById(postId)
       if(req.user.id == oldPost.creator){
        if(!req.files){
            updatedPost = await Post.findByIdAndUpdate(postId,{title,category,description},{new:true})
        }else{
            //get old post from database
            const oldPost = await Post.findById(postId);
            //delete old thumbnail from upload
            fs.unlink(path.join(__dirname,'..','uploads',oldPost.thumbnail),async(err)=>{
                    if(err){
                        return next(new HttpError(err))
                    }
            })
             // upload new thumbnail 
             const{thumbnail} = req.files;
             // check file size 
             if(thumbnail.size > 2000000){
                 return next(new HttpError("Thumbnail too big. should be less than 2kb"))
             }
             fileName = thumbnail.name;
             let splittedFileName = fileName.split('.');
             newFileName = splittedFileName[0] + uuid()+ "." + splittedFileName[splittedFileName.length -1]
             thumbnail.mv(path.join(__dirname,'..','uploads',newFileName),async(err)=>{
                 if(err){
                     return next(new HttpError(err))
                 }
             })
             updatedPost = await Post.findByIdAndUpdate(postId,{title,category,description,thumbnail:newFileName}, {new:true});
        }
       }
        if(!updatedPost){
            return next(new HttpError("Could't update post.",400))
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        return next(new HttpError(error))
    }
}
//========================delete post
// DELETE: api/posts/:id
//protected

const deletePosts = async(req,res,next) =>{
    try {
        const postId = req.params.id;
        if(!postId){
            return next(new HttpError("Post unavailable",400))
        }
        const post = await Post.findById(postId);
        const fileName = post?.thumbnail;
        // delete thumbnail from uploads folder
        if(req.user.id == post.creator){
            fs.unlink(path.join(__dirname,'..','uploads',fileName),async(err)=>{
                if(err){
                    return next(new HttpError(err))
                } else{
                    await Post.findByIdAndDelete(postId)
                    // find user and reduce post count by -1
                    const currentUser = await User.findById(req.user.id);
                    const userPostCount = currentUser?.posts - 1;
                    await User.findByIdAndUpdate(req.user.id,{posts:userPostCount})
                    res.json(`Post ${postId} deleted successfully.`)
                }
            })
        }else{
            return next(new HttpError("Post couldn't be deleted",403))
        }
        

    } catch (error) {
        return next(new HttpError(error))
    }
}

module.exports = {createPost,getPosts,getPost,deletePosts,editPosts,getCatPosts,getUserPosts}