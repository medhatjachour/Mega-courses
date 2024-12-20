# Nextjs Learning Management App

**Build a Scalable Learning Management Application with Next.js, Node.js, and AWS.**

## Introduction
This project aims to create an enterprise-grade Learning Management Application where teachers can upload courses and students can enroll in them. The application leverages modern web technologies and AWS services to ensure scalability, performance, and maintainability.

## Tech Stack

### Frontend
- **Framework**: Next.js
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS, Shadcn
- **Programming Language**: TypeScript
- **Animations**: Framer Motion
- **Forms**: React Hook Form, Zod
- **Payments**: Stripe

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Containerization**: Docker
- **Serverless**: AWS Lambda, API Gateway
- **Database**: DynamoDB
- **Storage**: S3
- **Content Delivery**: CloudFront

### Authentication
- **Auth Provider**: Clerk

### Hosting
- **Frontend**: Vercel

## Features
- **Teacher Functionality**: Upload courses.
- **Student Functionality**: View and enroll in courses.
- **Responsive Design**: Ensures the application is usable on all devices.
- **Secure Authentication**: Integrated with Clerk for secure user authentication.
- **Real-time Updates**: Leverages WebSockets and Server-Sent Events.
- **Scalable Architecture**: Utilizes AWS services for scalable backend and storage solutions.
- **Payment Integration**: Handles payments with Stripe.

## Project Setup

### Prerequisites
- Node.js (version >= 14)
- Docker
- AWS Account
- Vercel Account
- Clerk Account

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/medhatjachour/mega-courses.git
   cd mega-courses

First, Create .env for the server and the client :
First, run the development server:
---
```bash
cd server
npm i
npm run dev

cd client
npm i
npm run dev

```
to start the db 
```bash

java -D"java.library.path=YourDbPath\DynamoDBLocal_lib" -jar YourDbPath\DynamoDBLocal.jar -sharedDb

# java -D"java.library.path=C:\Users\Medha\Downloads\dynmodb\DynamoDBLocal_lib" -jar C:\Users\Medha\Downloads\dynmodb\DynamoDBLocal.jar -sharedDb

aws dynamodb list-tables --endpoint-url http://localhost:8000

```
# Deployment
Docker Deployment:

```bash

docker build -t nextjs-lms-app .
docker run -p 3000:3000 nextjs-lms-app
```
# environment Variables
Create a .env.local file in the root directory and add the following environment variables:
```bash
NEXT_PUBLIC_CLERK_FRONTEND_API=your-clerk-frontend-api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
DYNAMO_DB_TABLE_NAME=your-dynamodb-table-name
S3_BUCKET_NAME=your-s3-bucket-name

```

# Contributing
Contributions are welcome! Please open an issue or submit a pull request with your changes.

 # License
This project is licensed under the MIT License.

#Contact
For any inquiries, please contact [medhatjachour] at [medhatjashour19@gmail.com].