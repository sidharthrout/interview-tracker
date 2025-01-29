# Interview Tracker

A modern web application to track your job interviews and sync them with Google Calendar. Built with Next.js, Prisma, and TypeScript.

## Features

- Track job interviews with detailed information
- Sync interviews with Google Calendar
- Authentication with Google
- Responsive design with Tailwind CSS
- Real-time updates
- Interview status tracking

## Prerequisites

- Node.js 18+ installed
- A Google Cloud Platform account
- SQLite (included by default)

## Setup Instructions

1. Clone the repository and install dependencies:
```bash
cd interview-tracker
npm install
```

2. Set up Google OAuth:

   a. Go to [Google Cloud Console](https://console.cloud.google.com)
   b. Create a new project or select an existing one
   c. Enable the Google Calendar API
   d. Configure the OAuth consent screen:
      - Set user type to "External"
      - Add necessary scopes ("calendar" and "calendar.events")
   e. Create OAuth 2.0 credentials:
      - Application type: "Web application"
      - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
      - Save the Client ID and Client Secret

3. Configure environment variables:
   - Copy `.env` and update with your credentials:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-at-least-32-chars"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. Initialize the database:
```bash
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Sign in with your Google account
2. Click "Add Interview" to create a new interview entry
3. Fill in the interview details
4. The interview will be automatically synced with your Google Calendar
5. View and manage your interviews from the dashboard
6. Edit or delete interviews as needed

## Project Structure

```
interview-tracker/
├── src/
│   ├── app/                 # Next.js 14 app directory
│   ├── components/         # React components
│   └── types/             # TypeScript type definitions
├── prisma/                # Database schema and migrations
└── public/               # Static assets
```

## Security Notes

- The application uses NextAuth.js for secure authentication
- OAuth 2.0 with refresh tokens for persistent Google Calendar access
- Environment variables for sensitive credentials
- Database is secured with Prisma's security features

## Development

To add new features or make changes:

1. Create a new branch
2. Make your changes
3. Run tests (if available)
4. Create a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.
