# Accredian Backend Task
## Overview
The Accredian-backend-task project implements a backend system for an authorized referral system. Users can send referrals to other emails after logging in, while ensuring the integrity and uniqueness of the referral process. The system prevents users from sending referrals to themselves and from repeatedly sending referrals to the same recipient.

## Technologies Used
+ Express: Web framework for Node.js
+ Prisma: ORM for database interactions
+ Zod: Schema validation library for request validation and error handling

## Features
+ Referral Sending: Authenticated users can send referral emails to others.
+ Unique Referral ID Generation: Each referral has a unique ID generated for the user who sends it.
+ Self-Referral Prevention: Users cannot send referrals to themselves.
+ Duplicate Referral Prevention: Users cannot repeatedly send referrals to the same recipient.
+ Error handling : Errors and bugs have been completely handled.

## Installation

Clone the Repository
```
git clone https://github.com/saksham-malhotra-27/Accredian-backend-task
cd Accredian-backend-task
npm i
```
To run the backend
```
npm run dev
```

## Configure Environment Variables
Create a .env file in the root directory and add the necessary environment variables as written in the .env.sample file.

