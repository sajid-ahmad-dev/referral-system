# Multi-Level Referral and Earning System

A real-time referral and earning system that enables users to refer others and earn profits based on a multi-level hierarchy.

## Features

- User registration and authentication
- Multi-level referral system (up to 8 direct referrals)
- Real-time earnings tracking and updates
- Profit distribution:
  - 5% for direct referrals (Level 1)
  - 1% for indirect referrals (Level 2)
- Minimum purchase threshold of 1000Rs
- Real-time notifications using Socket.IO
- Detailed earnings reports and analytics

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm

## Installation

1. Clone the repository:

```bash
git clone <https://github.com/sajid-ahmad-dev/referral-system.git>

```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/referral-system
JWT_SECRET=your_jwt_secret_key_here
```

4. Start the server:

npm run dev

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile and referral stats

### Transactions

- `POST /api/earnings/purchase` - Create a new purchase
- `GET /api/earnings/history` - Get transaction history
- `GET /api/earnings/earnings` - Get earnings summary

## Real-time Updates

## Real-time Updates

The system uses Socket.IO for real-time updates. Clients can connect to receive live updates about:

http://localhost:4000/test-socket.html

- enter userID and JOin Room
- make a request in /api/earnings/purchase
- you can see the live update of purchase

- New purchases
- Earnings updates
- Referral activities

### User

- username
- email
- password
- referralCode
- referredBy
- directReferrals
- totalEarnings
- level1Earnings
- level2Earnings

### Earnings

- user
- amount
- profit
- type (PURCHASE/EARNING)
- status
- referralEarnings
- createdAt

## Security

- JWT-based authentication
- Password hashing using bcrypt
- Input validation using express-validator
- CORS enabled
- Environment variable configuration
