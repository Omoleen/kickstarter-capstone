import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User';
import Idea from '../models/Idea';
import Comment from '../models/Comment';
import Like from '../models/Like';
import Pledge from '../models/Pledge';
import connectDB from '../config/database';

// Sample users data
const sampleUsers = [
  {
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    password: 'password123'
  },
  {
    name: 'Alex Rodriguez',
    email: 'alex@example.com',
    password: 'password123'
  },
  {
    name: 'Jordan Kim',
    email: 'jordan@example.com',
    password: 'password123'
  },
  {
    name: 'Emma Davis',
    email: 'emma@example.com',
    password: 'password123'
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'password123'
  }
];

// Sample ideas data
const sampleIdeas = [
  {
    title: 'Smart Garden Assistant',
    description: 'An AI-powered device that monitors your plants and provides personalized care recommendations through a mobile app. The device would use sensors to track soil moisture, light levels, temperature, and humidity, then send notifications and care instructions directly to your phone. Perfect for busy plant parents who want to keep their green friends healthy!',
    authorIndex: 0 // Sarah Chen
  },
  {
    title: 'Local Skill Exchange Platform',
    description: 'A neighborhood app where people can trade skills and services without money - teach guitar for cooking lessons, design work for home repairs, tutoring for pet sitting. The platform would include skill verification, scheduling tools, and a rating system to build trust in the community.',
    authorIndex: 1 // Alex Rodriguez
  },
  {
    title: 'Study Buddy Matching Service',
    description: 'An app that connects students studying the same subjects based on learning styles, schedules, and academic goals. Features would include virtual study rooms, progress tracking, shared note-taking, and gamified learning challenges to keep students motivated.',
    authorIndex: 2 // Jordan Kim
  },
  {
    title: 'Sustainable Fashion Rental Marketplace',
    description: 'A platform where people can rent high-quality, designer clothing for special occasions instead of buying fast fashion. Users can list their own clothes for rent or browse available items by size, style, and occasion. Includes cleaning services and insurance coverage.',
    authorIndex: 0 // Sarah Chen
  },
  {
    title: 'Mental Health Check-in Bot',
    description: 'A friendly AI chatbot that sends daily mood check-ins and provides personalized coping strategies, meditation exercises, and resources based on user responses. Includes crisis detection and connection to professional help when needed.',
    authorIndex: 3 // Emma Davis
  },
  {
    title: 'Community Tool Library',
    description: 'A neighborhood sharing system for tools and equipment that people rarely use. Members can borrow power tools, camping gear, kitchen appliances, and more instead of buying items they\'ll only use occasionally. Includes booking system and maintenance tracking.',
    authorIndex: 4 // Mike Johnson
  }
];

// Sample comments data
const sampleComments = [
  {
    content: 'This is brilliant! I kill every plant I touch. Would love to beta test this.',
    ideaIndex: 0,
    authorIndex: 4 // Mike Johnson
  },
  {
    content: 'How would it handle different plant species? Each plant has very different needs.',
    ideaIndex: 0,
    authorIndex: 3 // Emma Davis
  },
  {
    content: 'Love this concept! How would you verify skills to prevent fraud?',
    ideaIndex: 1,
    authorIndex: 2 // Jordan Kim
  },
  {
    content: 'This could really help reduce social isolation in neighborhoods. Great idea!',
    ideaIndex: 1,
    authorIndex: 0 // Sarah Chen
  },
  {
    content: 'As a college student, this would be incredibly helpful during finals season.',
    ideaIndex: 2,
    authorIndex: 1 // Alex Rodriguez
  },
  {
    content: 'The fashion industry needs more sustainable solutions like this. Count me in!',
    ideaIndex: 3,
    authorIndex: 4 // Mike Johnson
  },
  {
    content: 'Mental health support is so important. How would you ensure user privacy?',
    ideaIndex: 4,
    authorIndex: 2 // Jordan Kim
  },
  {
    content: 'We actually started something similar in our neighborhood. Happy to share lessons learned!',
    ideaIndex: 5,
    authorIndex: 1 // Alex Rodriguez
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Idea.deleteMany({}),
      Comment.deleteMany({}),
      Like.deleteMany({}),
      Pledge.deleteMany({})
    ]);
    
    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name}`);
    }
    
    // Create ideas
    console.log('💡 Creating ideas...');
    const createdIdeas = [];
    for (const ideaData of sampleIdeas) {
      const idea = new Idea({
        title: ideaData.title,
        description: ideaData.description,
        author: createdUsers[ideaData.authorIndex]._id
      });
      await idea.save();
      createdIdeas.push(idea);
      console.log(`✅ Created idea: ${idea.title}`);
    }
    
    // Create comments
    console.log('💬 Creating comments...');
    for (const commentData of sampleComments) {
      const comment = new Comment({
        content: commentData.content,
        author: createdUsers[commentData.authorIndex]._id,
        idea: createdIdeas[commentData.ideaIndex]._id
      });
      await comment.save();
      console.log(`✅ Created comment by ${createdUsers[commentData.authorIndex].name}`);
    }
    
    // Create some likes
    console.log('❤️ Creating likes...');
    const likeData = [
      { ideaIndex: 0, userIndexes: [1, 2, 3, 4] }, // Smart Garden - 4 likes
      { ideaIndex: 1, userIndexes: [0, 2, 4] },    // Skill Exchange - 3 likes
      { ideaIndex: 2, userIndexes: [0, 1, 3, 4] }, // Study Buddy - 4 likes
      { ideaIndex: 3, userIndexes: [1, 2] },       // Fashion Rental - 2 likes
      { ideaIndex: 4, userIndexes: [0, 1, 2] },    // Mental Health - 3 likes
      { ideaIndex: 5, userIndexes: [0, 3] }        // Tool Library - 2 likes
    ];
    
    for (const { ideaIndex, userIndexes } of likeData) {
      for (const userIndex of userIndexes) {
        const like = new Like({
          user: createdUsers[userIndex]._id,
          idea: createdIdeas[ideaIndex]._id
        });
        await like.save();
      }
      console.log(`✅ Created ${userIndexes.length} likes for: ${createdIdeas[ideaIndex].title}`);
    }
    
    // Create some pledges
    console.log('💰 Creating pledges...');
    const pledgeData = [
      { ideaIndex: 0, userIndexes: [1, 3] },       // Smart Garden - 2 pledges ($50)
      { ideaIndex: 1, userIndexes: [0, 2, 4] },    // Skill Exchange - 3 pledges ($75)
      { ideaIndex: 2, userIndexes: [0, 1] },       // Study Buddy - 2 pledges ($50)
      { ideaIndex: 3, userIndexes: [4] },          // Fashion Rental - 1 pledge ($25)
      { ideaIndex: 4, userIndexes: [1, 2] },       // Mental Health - 2 pledges ($50)
      { ideaIndex: 5, userIndexes: [0] }           // Tool Library - 1 pledge ($25)
    ];
    
    for (const { ideaIndex, userIndexes } of pledgeData) {
      for (const userIndex of userIndexes) {
        const pledge = new Pledge({
          user: createdUsers[userIndex]._id,
          idea: createdIdeas[ideaIndex]._id,
          amount: 25 // Fixed $25 amount as per requirements
        });
        await pledge.save();
      }
      console.log(`✅ Created ${userIndexes.length} pledges for: ${createdIdeas[ideaIndex].title}`);
    }
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${createdUsers.length}`);
    console.log(`💡 Ideas: ${createdIdeas.length}`);
    console.log(`💬 Comments: ${sampleComments.length}`);
    console.log(`❤️ Likes: ${likeData.reduce((sum, item) => sum + item.userIndexes.length, 0)}`);
    console.log(`💰 Pledges: ${pledgeData.reduce((sum, item) => sum + item.userIndexes.length, 0)}`);
    
    console.log('\n🔑 Test Accounts:');
    createdUsers.forEach(user => {
      console.log(`📧 ${user.email} | 🔒 password123`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding function immediately
seedDatabase();

export default seedDatabase;
