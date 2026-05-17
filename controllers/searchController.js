const User = require('../models/User');
const Job = require('../models/Job');

exports.search = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.render('search/results', { title: 'Search | ProNet', users: [], jobs: [], query: '' });
        }

        const regex = new RegExp(query, 'i');

        const users = await User.find({
            $or: [
                { name: regex },
                { headline: regex },
                { location: regex },
                { 'experience.company': regex }
            ]
        }).limit(10);

        const jobs = await Job.find({
            $or: [
                { title: regex },
                { company: regex },
                { location: regex }
            ]
        }).limit(10);

        res.render('search/results', { title: `Search results for "${query}"`, users, jobs, query });
    } catch (err) {
        req.flash('error_msg', 'Search failed');
        res.redirect('/feed');
    }
};
