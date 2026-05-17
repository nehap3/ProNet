const Message = require('../models/Message');
const User = require('../models/User');

exports.getMessages = async (req, res) => {
    try {
        // Find users with whom we have messages
        const messages = await Message.find({
            $or: [{ sender: req.userId }, { receiver: req.userId }]
        }).sort('-createdAt');

        const userIds = new Set();
        messages.forEach(msg => {
            if (msg.sender.toString() !== req.userId) userIds.add(msg.sender.toString());
            if (msg.receiver.toString() !== req.userId) userIds.add(msg.receiver.toString());
        });

        const conversations = await User.find({ _id: { $in: Array.from(userIds) } })
            .select('name profilePhoto headline');

        // Check if viewing a specific chat
        const activeChatId = req.query.user;
        let activeChatUser = null;
        let chatHistory = [];

        if (activeChatId) {
            activeChatUser = await User.findById(activeChatId).select('name profilePhoto');
            chatHistory = await Message.find({
                $or: [
                    { sender: req.userId, receiver: activeChatId },
                    { sender: activeChatId, receiver: req.userId }
                ]
            }).sort('createdAt');
            
            // Mark as read
            await Message.updateMany(
                { sender: activeChatId, receiver: req.userId, isRead: false },
                { $set: { isRead: true } }
            );
        }

        res.render('messages/index', { 
            title: 'Messaging | ProNet', 
            conversations, 
            activeChatUser, 
            chatHistory 
        });
    } catch (err) {
        req.flash('error_msg', 'Failed to load messages');
        res.redirect('/feed');
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { receiver, content } = req.body;
        
        await Message.create({
            sender: req.userId,
            receiver,
            content
        });

        res.redirect(`/messages?user=${receiver}`);
    } catch (err) {
        req.flash('error_msg', 'Failed to send message');
        res.redirect('back');
    }
};
