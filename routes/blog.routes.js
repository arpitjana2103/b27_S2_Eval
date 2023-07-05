const express = require('express');
const {BlogModel} = require('../model/blog.model.js');

const blogRouter = express.Router();

const {auth} = require('../middleware/auth.middleware.js');
const {authz} = require('../middleware/authz.middleware.js')

blogRouter.get('/allBlogs', getAllBlogsLogic);
blogRouter.get('/', auth, authz(['User']), getBlogbyUser);
blogRouter.post('/create', auth, authz(['User']), createBlogLogic);
blogRouter.patch('/update/:blogID', auth,authz(['User']), updateBlogLogic);
blogRouter.delete('/delete/:blogID', auth,authz(['User', 'Moderator']), deleteBlogLogic);

async function getBlogbyUser(req, res){
 const userID = req.body.userID;
 try {
    const blogs = await BlogModel.find({userID: userID});
    res.status(200).json({
        status: 'ok',
        blogs: blogs,
    });
} catch (error) {
    return res.status(400).json({
        status: 'fail',
        error: error.message,
    });
}
}

async function getAllBlogsLogic(req, res) {
    try {
        const blogs = await BlogModel.find({});
        res.status(200).json({
            status: 'ok',
            blogs: blogs,
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error.message,
        });
    }
}

async function createBlogLogic(req, res) {
    try {
        console.log(req.body);
        const blog = new BlogModel(req.body);
        await blog.save();
        return res.status(200).json({
            status: 'ok',
            message: 'New Blog has been added',
            blog: blog,
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error.message,
        });
    }
}

async function updateBlogLogic(req, res) {
    try {
        const blogID = req.params.blogID;
        const blog = await BlogModel.findOne({_id: blogID});
        console.log(blog.userID, req.body.userID);
        if (blog.userID !== req.body.userID)
            throw new Error('Unauthorized User');

        await BlogModel.findByIdAndUpdate({_id: blogID}, req.body);
        const updatedBlog = await BlogModel.findOne({_id: blogID});

        return res.status(200).json({
            status: 'ok',
            message: 'Blog is Updated Successfully',
            updatedBlog: updatedBlog,
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error.message,
        });
    }
}

async function deleteBlogLogic(req, res) {
    try {
        const blogID = req.params.blogID;
        const blog = await BlogModel.findOne({_id: blogID});

        if (!blog) throw new Error('Blog not found');

        if (blog.userID !== req.body.userID)
            throw new Error('Unauthorized User');

        await BlogModel.findByIdAndDelete({_id: blogID});

        return res.status(200).json({
            status: 'ok',
            message: 'Blog is Deleted Successfully',
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error.message,
        });
    }
}

module.exports = {blogRouter};
