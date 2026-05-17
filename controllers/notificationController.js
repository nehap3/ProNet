// Note: In a fully fleshed out app, Notification records would be created inside 
// other controllers (like when liking a post or sending a connection request).
// Here we are providing the controller to fetch them.
const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.userId })
            .populate('sender', 'name profilePhoto')
            .populate('post', 'content')
            .sort('-createdAt');
            
        // Mark all as read when visited
        await Notification.updateMany(
            { recipient: req.userId, isRead: false },
            { $set: { isRead: true } }
        );

        res.render('notifications/index', { title: 'Notifications | ProNet', notifications });
    } catch (err) {
        req.flash('error_msg', 'Failed to load notifications');
        res.redirect('/feed');
    }
};
