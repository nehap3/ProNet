const User = require('../models/User');

exports.viewProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('connections', 'name headline profilePhoto');
        if (!user) {
            req.flash('error_msg', 'User not found');
            return res.redirect('/feed');
        }
        res.render('profile/view', { title: `${user.name} | ProNet`, profileUser: user });
    } catch (err) {
        req.flash('error_msg', 'Server Error');
        res.redirect('/feed');
    }
};

exports.editProfilePage = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        res.render('profile/edit', { title: 'Edit Profile', user });
    } catch (err) {
        req.flash('error_msg', 'Server Error');
        res.redirect('/feed');
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, headline, location, about, skills, isOpenToWork } = req.body;
        
        let updateData = {
            name, headline, location, about, 
            isOpenToWork: isOpenToWork === 'on',
            skills: skills ? skills.split(',').map(s => s.trim()) : []
        };

        if (req.file) {
            updateData.profilePhoto = '/uploads/' + req.file.filename;
        }

        await User.findByIdAndUpdate(req.userId, updateData);
        req.flash('success_msg', 'Profile updated successfully');
        res.redirect(`/profile/${req.userId}`);
    } catch (err) {
        req.flash('error_msg', 'Failed to update profile');
        res.redirect(`/profile/edit`);
    }
};

exports.addExperience = async (req, res) => {
    try {
        const { company, role, duration, description } = req.body;
        await User.findByIdAndUpdate(req.userId, {
            $push: { experience: { company, role, duration, description } }
        });
        req.flash('success_msg', 'Experience added');
        res.redirect('/profile/edit');
    } catch (err) {
        req.flash('error_msg', 'Failed to add experience');
        res.redirect('/profile/edit');
    }
};

exports.addEducation = async (req, res) => {
    try {
        const { college, degree, year, cgpa } = req.body;
        await User.findByIdAndUpdate(req.userId, {
            $push: { education: { college, degree, year, cgpa } }
        });
        req.flash('success_msg', 'Education added');
        res.redirect('/profile/edit');
    } catch (err) {
        req.flash('error_msg', 'Failed to add education');
        res.redirect('/profile/edit');
    }
};
