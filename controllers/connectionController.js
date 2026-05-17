const Connection = require('../models/Connection');
const User = require('../models/User');

exports.getNetwork = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .populate('connections', 'name headline profilePhoto')
            .populate('pendingRequests', 'name headline profilePhoto');
            
        const suggestions = await User.find({
            _id: { $nin: [...user.connections, ...user.pendingRequests, ...user.sentRequests, req.userId] }
        }).limit(9);

        res.render('connections/index', { title: 'My Network | ProNet', user, suggestions });
    } catch (err) {
        req.flash('error_msg', 'Failed to load network');
        res.redirect('/feed');
    }
};

exports.sendRequest = async (req, res) => {
    try {
        const recipientId = req.params.id;
        await User.findByIdAndUpdate(req.userId, { $push: { sentRequests: recipientId } });
        await User.findByIdAndUpdate(recipientId, { $push: { pendingRequests: req.userId } });
        
        req.flash('success_msg', 'Connection request sent');
        res.redirect('back');
    } catch (err) {
        req.flash('error_msg', 'Error sending request');
        res.redirect('back');
    }
};

exports.acceptRequest = async (req, res) => {
    try {
        const senderId = req.params.id;
        
        // Remove from pending/sent and add to connections for both
        await User.findByIdAndUpdate(req.userId, {
            $pull: { pendingRequests: senderId },
            $push: { connections: senderId }
        });
        
        await User.findByIdAndUpdate(senderId, {
            $pull: { sentRequests: req.userId },
            $push: { connections: req.userId }
        });

        req.flash('success_msg', 'Connection request accepted');
        res.redirect('back');
    } catch (err) {
        req.flash('error_msg', 'Error accepting request');
        res.redirect('back');
    }
};

exports.rejectRequest = async (req, res) => {
    try {
        const senderId = req.params.id;
        
        await User.findByIdAndUpdate(req.userId, { $pull: { pendingRequests: senderId } });
        await User.findByIdAndUpdate(senderId, { $pull: { sentRequests: req.userId } });

        req.flash('success_msg', 'Connection request rejected');
        res.redirect('back');
    } catch (err) {
        req.flash('error_msg', 'Error rejecting request');
        res.redirect('back');
    }
};

exports.removeConnection = async (req, res) => {
    try {
        const connectionId = req.params.id;
        
        await User.findByIdAndUpdate(req.userId, { $pull: { connections: connectionId } });
        await User.findByIdAndUpdate(connectionId, { $pull: { connections: req.userId } });

        req.flash('success_msg', 'Connection removed');
        res.redirect('back');
    } catch (err) {
        req.flash('error_msg', 'Error removing connection');
        res.redirect('back');
    }
};
