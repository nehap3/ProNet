require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const Job = require('./models/Job');
const fs = require('fs');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for Seeding');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const usersData = [
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        headline: 'Software Engineer at TechCorp',
        location: 'San Francisco, CA',
        about: 'Passionate about building scalable web applications.',
        profilePhoto: 'https://ui-avatars.com/api/?name=John+Doe&background=random'
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        headline: 'Product Manager',
        location: 'New York, NY',
        about: 'Driving product vision and strategy.',
        profilePhoto: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random'
    },
    {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password123',
        headline: 'Data Scientist',
        location: 'Austin, TX',
        about: 'Extracting insights from complex datasets.',
        profilePhoto: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=random'
    }
];

const seedDB = async () => {
    await connectDB();
    
    try {
        // Clear existing data
        await User.deleteMany();
        await Post.deleteMany();
        await Job.deleteMany();
        console.log('Data Cleared!');

        // Insert Users
        const createdUsers = [];
        for (let u of usersData) {
            const user = await User.create(u);
            createdUsers.push(user);
        }
        console.log('Users created!');

        // Insert Posts
        const postData = [
            {
                author: createdUsers[0]._id,
                content: 'Just launched our new product! Super excited for what is to come.'
            },
            {
                author: createdUsers[1]._id,
                content: 'Looking for a talented UX Designer to join my team.'
            }
        ];
        await Post.insertMany(postData);
        console.log('Posts created!');

        // Insert Jobs
        const jobData = [
            {
                title: 'Senior Frontend Developer',
                company: 'TechCorp',
                location: 'Remote',
                type: 'Remote',
                description: 'We are looking for a senior developer with React expertise.',
                requirements: '5+ years experience in React, JavaScript, HTML, CSS',
                salary: '$120k - $150k',
                postedBy: createdUsers[0]._id
            },
            {
                title: 'Data Analyst',
                company: 'DataSolutions',
                location: 'New York, NY',
                type: 'Hybrid',
                description: 'Join our analytics team to build awesome dashboards.',
                requirements: 'SQL, Python, Tableau',
                salary: '$90k - $110k',
                postedBy: createdUsers[2]._id
            }
        ];
        await Job.insertMany(jobData);
        console.log('Jobs created!');

        // Create uploads dir if doesn't exist
        if (!fs.existsSync('./public/uploads')) {
            fs.mkdirSync('./public/uploads', { recursive: true });
        }

        console.log('Seeding Complete!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
