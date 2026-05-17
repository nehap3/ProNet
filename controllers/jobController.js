const Job = require('../models/Job');
const User = require('../models/User');

exports.getJobs = async (req, res) => {
    try {
        const { location, type } = req.query;
        let query = {};
        
        if (location) query.location = new RegExp(location, 'i');
        if (type) query.type = type;

        const jobs = await Job.find(query).populate('postedBy', 'name company').sort('-createdAt');
        res.render('jobs/index', { title: 'Jobs | ProNet', jobs, query: req.query });
    } catch (err) {
        req.flash('error_msg', 'Error loading jobs');
        res.redirect('/feed');
    }
};

exports.getJobDetail = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'name profilePhoto headline');
        const user = await User.findById(req.userId);
        const hasApplied = user.appliedJobs.includes(job._id);
        const hasSaved = user.savedJobs.includes(job._id);

        res.render('jobs/detail', { title: `${job.title} | ProNet`, job, hasApplied, hasSaved });
    } catch (err) {
        req.flash('error_msg', 'Error loading job details');
        res.redirect('/jobs');
    }
};

exports.applyJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        
        await Job.findByIdAndUpdate(jobId, { $addToSet: { applicants: req.userId } });
        await User.findByIdAndUpdate(req.userId, { $addToSet: { appliedJobs: jobId } });

        req.flash('success_msg', 'Successfully applied for the job!');
        res.redirect(`/jobs/${jobId}`);
    } catch (err) {
        req.flash('error_msg', 'Failed to apply for job');
        res.redirect('back');
    }
};

exports.saveJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        
        await User.findByIdAndUpdate(req.userId, { $addToSet: { savedJobs: jobId } });

        req.flash('success_msg', 'Job saved!');
        res.redirect(`/jobs/${jobId}`);
    } catch (err) {
        req.flash('error_msg', 'Failed to save job');
        res.redirect('back');
    }
};
