# Inova - Digital Content Management & Automation Platform

A sophisticated Next.js-based platform for managing digital content creation, automation, and analytics across multiple channels. Built with TypeScript and integrated with AWS services for scalable content processing and automation.

## Core Features

### 1. Content Management & Automation
- Multi-channel artist management system
- Automated content processing pipeline via AWS Fargate
- S3 bucket integration for asset management
- Task scheduling and orchestration
- YouTube channel integration and management

### 2. Analytics Dashboard
- Real-time performance metrics
- Channel-specific analytics
- Revenue tracking and growth analysis
- Watch time and view count monitoring
- Weekly and monthly performance breakdowns

### 3. Task Management System
- AWS Fargate instance management
- Automated task scheduling and monitoring
- Resource allocation controls
- Multi-instance deployment capabilities
- Real-time task status monitoring

## Technical Architecture

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom gradients
- **State Management**: React Hooks
- **Analytics**: Recharts for data visualization
- **Animations**: Framer Motion
- **UI Components**: Lucide React icons
- **Notifications**: React Hot Toast

### Backend Services
- **Cloud Provider**: AWS
- **Compute**: AWS Fargate/ECS
- **Storage**: S3 Buckets
- **API Routes**: Next.js API Routes
- **YouTube API**: Google APIs integration

## AWS Integration

### ECS/Fargate Configuration
- Task Definitions:
  - Audio Mixing (max 25 instances)
  - Video Mix (max 25 instances)
  - YouTube Upload (max 1 instance)
- Automated scheduling
- Resource monitoring
- Task status tracking

### S3 Integration
- Multi-bucket management
- Asset processing automation
- Prefix-based organization
- Bucket statistics tracking

## Project Structure
```
├── app/
│   ├── api/              # API endpoints
│   │   ├── bucket-stats/ # S3 statistics
│   │   ├── launch-ecs/   # ECS task management
│   │   └── running-tasks/# Task monitoring
│   ├── artists/          # Artist management
│   ├── stats/           # Analytics dashboard
│   └── mainapp/         # Core application
├── components/          # Reusable components
├── config/             # AWS configuration
├── data/              # Static data
├── utils/             # Utility functions
└── types/             # TypeScript definitions
```

## Environment Setup

Create a `.env.local` file with the following configurations:

```bash
# AWS Configuration
NEXT_PUBLIC_AWS_REGION=your_aws_region
NEXT_PUBLIC_AWS_BUCKET_NAME=your_bucket_name
NEXT_PUBLIC_AWS_ECS_CLUSTER=your_cluster_name
NEXT_PUBLIC_AWS_SUBNET_ID=your_subnet_id
NEXT_PUBLIC_AWS_SECURITY_GROUP_ID=your_security_group_id
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Access the application at [http://localhost:3000](http://localhost:3000)

## AWS Service Requirements

### Required IAM Permissions
- ECS:RunTask
- ECS:ListTasks
- ECS:DescribeTasks
- S3:ListObjects
- S3:GetObject

### Network Configuration
- VPC with public subnets
- Security group with appropriate outbound rules
- Internet Gateway for public access

## Features in Detail

### Artist Management
- Individual artist dashboards
- Asset management per artist
- Performance tracking
- Automated content generation

### Analytics Features
- Revenue tracking and forecasting
- View count analysis
- Watch time metrics
- Growth rate calculations
- Channel-specific breakdowns

### Task Automation
- Scheduled task execution
- Resource optimization
- Status monitoring
- Error handling and reporting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Security

- All AWS credentials must be properly secured
- Environment variables must be set for all sensitive data
- API routes include proper error handling
- Rate limiting implemented where necessary

## License

[MIT](https://choosealicense.com/licenses/mit/)


# capricorn
# capricorn
