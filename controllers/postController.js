const Post = require('../models/Post');
const User = require('../models/User');

exports.getFeed = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('connections');
        const connectionIds = user.connections.map(c => c._id);
        connectionIds.push(req.userId); // Show own posts too

        const posts = await Post.find({ author: { $in: connectionIds } })
            .populate('author', 'name headline profilePhoto')
            .populate('comments.user', 'name profilePhoto')
            .sort('-createdAt');

        // Suggestions (users not connected with)
        const suggestions = await User.find({
            _id: { $nin: [...connectionIds] }
        }).limit(5);

        res.render('feed/index', { title: 'Feed | ProNet', posts, suggestions });
    } catch (err) {
        req.flash('error_msg', 'Failed to load feed');
        res.redirect('/');
    }
};

exports.createPost = async (req, res) => {
    try {
        const { content } = req.body;
        let image = null;

        if (req.file) {
            image = '/uploads/' + req.file.filename;
        }

        await Post.create({
            author: req.userId,
            content,
            image
        });

        req.flash('success_msg', 'Post created successfully');
        res.redirect('/feed');
    } catch (err) {
        req.flash('error_msg', 'Error creating post');
        res.redirect('/feed');
    }
};

exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (post.likes.includes(req.userId)) {
            post.likes.pull(req.userId);
        } else {
            post.likes.push(req.userId);
            // Optionally add notification here
        }
        await post.save();
        res.redirect('back');
    } catch (err) {
        req.flash('error_msg', 'Error liking post');
        res.redirect('back');
    }
};

exports.commentPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        post.comments.push({
            user: req.userId,
            text: req.body.text
        });
        await post.save();
        res.redirect('back');
    } catch (err) {
        req.flash('error_msg', 'Error adding comment');
        res.redirect('back');
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.author.toString() === req.userId) {
            await Post.findByIdAndDelete(req.params.id);
            req.flash('success_msg', 'Post deleted');
        } else {
            req.flash('error_msg', 'Not authorized');
        }
        res.redirect('back');
    } catch (err) {
        req.flash('error_msg', 'Error deleting post');
        res.redirect('back');
    }
};
