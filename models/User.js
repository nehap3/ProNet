const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
    headline: {
        type: String,
        default: 'LinkedIn Member'
    },
    location: {
        type: String,
        default: ''
    },
    about: {
        type: String,
        default: ''
    },
    profilePhoto: {
        type: String,
        default: 'https://ui-avatars.com/api/?name=User&background=random'
    },
    coverPhoto: {
        type: String,
        default: '/images/default-cover.jpg' // Default cover image if any
    },
    skills: [String],
    experience: [{
        company: String,
        role: String,
        duration: String,
        description: String
    }],
    education: [{
        college: String,
        degree: String,
        year: String,
        cgpa: String
    }],
    isOpenToWork: {
        type: Boolean,
        default: false
    },
    connections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    pendingRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    sentRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    savedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }],
    appliedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }],
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, { timestamps: true });

// Fire a function before doc saved to db
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire (10 minutes)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
