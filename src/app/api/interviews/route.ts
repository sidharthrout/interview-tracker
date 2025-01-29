import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'
import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

const prisma = new PrismaClient()

const getGoogleCalendarClient = async (accessToken: string) => {
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  
  oauth2Client.setCredentials({
    access_token: accessToken
  })

  return google.calendar({ version: 'v3', auth: oauth2Client })
}

// Get user's timezone or default to local system timezone
const getUserTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch (error) {
    return 'Asia/Tokyo' // Default to Tokyo timezone since that's what we see in the environment
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { company, position, date, status, round, location, notes, salary } = data
    const userTimeZone = getUserTimeZone()

    // Create interview in database with the exact date provided
    const interview = await prisma.interview.create({
      data: {
        userId: session.user.id,
        company,
        position,
        date: new Date(date), // Store the date exactly as provided
        status,
        round,
        location,
        notes,
        salary
      }
    })

    // Get user's Google account
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: 'google'
      }
    })

    // Create Google Calendar event if account exists
    if (account?.access_token) {
      try {
        const calendar = await getGoogleCalendarClient(account.access_token)
        
        const event = await calendar.events.insert({
          calendarId: 'primary',
          requestBody: {
            summary: `${position} Interview at ${company}`,
            description: `Round: ${round}\nNotes: ${notes || 'None'}`,
            start: {
              dateTime: new Date(date).toISOString(),
              timeZone: userTimeZone // Use user's timezone
            },
            end: {
              dateTime: new Date(new Date(date).getTime() + 60 * 60 * 1000).toISOString(),
              timeZone: userTimeZone // Use user's timezone
            },
            location,
            reminders: {
              useDefault: true
            }
          }
        })

        // Update interview with calendar event ID
        await prisma.interview.update({
          where: { id: interview.id },
          data: { calendarEventId: event.data.id }
        })
      } catch (error) {
        console.error('Error creating calendar event:', error)
        // Continue without calendar event if there's an error
      }
    }

    return NextResponse.json(interview)
  } catch (error) {
    console.error('Error creating interview:', error)
    return NextResponse.json(
      { error: 'Failed to create interview' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const interviews = await prisma.interview.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(interviews)
  } catch (error) {
    console.error('Error fetching interviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch interviews' },
      { status: 500 }
    )
  }
}
