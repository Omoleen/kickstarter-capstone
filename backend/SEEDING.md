# Database Seeding

This document explains how to seed the database with sample data for development and testing.

## Quick Start

```bash
# Make sure MongoDB is running
# Then run the seed script
npm run seed
```

## What Gets Created

### 👥 Users (5)
- **Sarah Chen** - sarah@example.com
- **Alex Rodriguez** - alex@example.com  
- **Jordan Kim** - jordan@example.com
- **Emma Davis** - emma@example.com
- **Mike Johnson** - mike@example.com

**Password for all accounts:** `password123`

### 💡 Ideas (6)
1. **Smart Garden Assistant** (by Sarah)
2. **Local Skill Exchange Platform** (by Alex)
3. **Study Buddy Matching Service** (by Jordan)
4. **Sustainable Fashion Rental Marketplace** (by Sarah)
5. **Mental Health Check-in Bot** (by Emma)
6. **Community Tool Library** (by Mike)

### 💬 Comments (8)
Realistic comments distributed across the ideas with engaging discussions.

### ❤️ Likes (18 total)
- Smart Garden Assistant: 4 likes
- Local Skill Exchange: 3 likes
- Study Buddy Matching: 4 likes
- Fashion Rental: 2 likes
- Mental Health Bot: 3 likes
- Tool Library: 2 likes

### 💰 Pledges (11 total, $275)
- Smart Garden Assistant: $50 (2 pledges)
- Local Skill Exchange: $75 (3 pledges)
- Study Buddy Matching: $50 (2 pledges)
- Fashion Rental: $25 (1 pledge)
- Mental Health Bot: $50 (2 pledges)
- Tool Library: $25 (1 pledge)

## Commands

```bash
# Development seeding (with TypeScript)
npm run seed

# Production seeding (requires build first)
npm run build
npm run seed:prod

# Clear and reseed (the script clears existing data automatically)
npm run seed
```

## Notes

- The script **clears all existing data** before seeding
- All passwords are `password123` for easy testing
- The data is designed to showcase all features of the app
- Each user has different interaction patterns (some like more, some pledge more)
- Ideas cover diverse topics to test the platform's versatility

## Testing Scenarios

After seeding, you can test:

1. **Login** with any of the 5 test accounts
2. **Browse ideas** with existing likes/pledges/comments
3. **Create new ideas** and see them alongside seeded ones
4. **Like/unlike** existing ideas (some users have already liked certain ideas)
5. **Pledge** to ideas (some users have already pledged)
6. **Comment** on ideas with existing discussions
7. **View profiles** with real statistics and posted ideas

## Troubleshooting

If seeding fails:
1. Make sure MongoDB is running
2. Check your `.env` file has correct `MONGODB_URI`
3. Ensure you have write permissions to the database
4. Check the console output for specific error messages
