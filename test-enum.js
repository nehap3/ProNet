const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');

// Load env vars
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB...');
        
        try {
            console.log('Attempting to save a Job with an INVALID enum type ("Space")...');
            
            const badJob = new Job({
                title: 'Test Job',
                company: 'Test Company',
                location: 'Remote',
                type: 'Space', // <--- INVALID ENUM (Must be Remote, Hybrid, or On-site)
                description: 'Test Description',
                requirements: 'Test Requirements',
                postedBy: new mongoose.Types.ObjectId()
            });

            await badJob.save();
            console.log('If you see this, the test FAILED. Mongoose allowed bad data.');

        } catch (error) {
            console.log('\n=============================================');
            console.log('✅ TEST SUCCESSFUL! Mongoose blocked the save:');
            console.log(error.message);
            console.log('=============================================\n');
        }

        mongoose.disconnect();
    })
    .catch(err => console.error(err));
