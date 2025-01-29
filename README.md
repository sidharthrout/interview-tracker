# Interview Tracker

A comprehensive web application for managing job interviews, built with Next.js 13+. Keep track of your interview schedule, sync with Google Calendar, and maintain detailed records of your job search journey.

## Features

- 📅 Calendar Integration with Google Calendar
- 🔄 Real-time Updates
- 🌐 Timezone-aware Scheduling
- 📝 Interview Notes and Preparation
- 📊 Status Tracking
- 🔒 Secure Authentication
- 📱 Responsive Design

## Tech Stack

- **Frontend**: Next.js 13+, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Prisma with SQLite
- **Authentication**: NextAuth.js
- **Calendar**: FullCalendar
- **Real-time Updates**: SWR

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/sidharthrout/interview-tracker.git
cd interview-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with:
```env
DATABASE_URL="file:./dev.db"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"
```

4. Initialize the database:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features in Detail

### Calendar View
- Month, week, and day views
- Click on any date to schedule an interview
- Visual indicators for different interview statuses
- Tooltips with interview details

### Interview Management
- Create, edit, and delete interviews
- Track company, position, and interview round
- Add notes and preparation materials
- Monitor interview status

### Google Calendar Integration
- Automatically sync interviews with Google Calendar
- Manage interview schedules in one place
- Receive calendar notifications and reminders

### Real-time Updates
- See changes instantly across all views
- Automatic data refresh
- No manual refresh needed

## Contributing

Feel free to open issues and pull requests for any improvements you'd like to add.

## License

This project is licensed under the MIT License.
