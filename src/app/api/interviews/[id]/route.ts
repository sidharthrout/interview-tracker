import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const interview = await prisma.interview.findUnique({
      where: { id: params.id }
    })

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
    }

    if (interview.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userTimeZone = getUserTimeZone()

    // Update interview in database
    const updatedInterview = await prisma.interview.update({
      where: { id: params.id },
      data: {
        company: data.company,
        position: data.position,
        date: new Date(data.date), // Store the date exactly as provided
        status: data.status,
        round: data.round,
        location: data.location,
        notes: data.notes,
        salary: data.salary
      }
    })

    // Update Google Calendar event if it exists
    if (interview.calendarEventId) {
      const account = await prisma.account.findFirst({
        where: {
          userId: session.user.id,
          provider: 'google'
        }
      })

      if (account?.access_token) {
        try {
          const calendar = await getGoogleCalendarClient(account.access_token)
          
          await calendar.events.update({
            calendarId: 'primary',
            eventId: interview.calendarEventId,
            requestBody: {
              summary: `${data.position} Interview at ${data.company}`,
              description: `Round: ${data.round}\nNotes: ${data.notes || 'None'}`,
              start: {
                dateTime: new Date(data.date).toISOString(),
                timeZone: userTimeZone // Use user's timezone
              },
              end: {
                dateTime: new Date(new Date(data.date).getTime() + 60 * 60 * 1000).toISOString(),
                timeZone: userTimeZone // Use user's timezone
              },
              location: data.location,
              reminders: {
                useDefault: true
              }
            }
          })
        } catch (error) {
          console.error('Error updating calendar event:', error)
          // Continue without calendar update if there's an error
        }
      }
    }

    return NextResponse.json(updatedInterview)
  } catch (error) {
    console.error('Error updating interview:', error)
    return NextResponse.json(
      { error: 'Failed to update interview' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const interview = await prisma.interview.findUnique({
      where: { id: params.id }
    })

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
    }

    if (interview.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete from Google Calendar if event exists
    if (interview.calendarEventId) {
      const account = await prisma.account.findFirst({
        where: {
          userId: session.user.id,
          provider: 'google'
        }
      })

      if (account?.access_token) {
        try {
          const calendar = await getGoogleCalendarClient(account.access_token)
          await calendar.events.delete({
            calendarId: 'primary',
            eventId: interview.calendarEventId
          })
        } catch (error) {
          console.error('Error deleting calendar event:', error)
          // Continue with interview deletion even if calendar deletion fails
        }
      }
    }

    // Delete the interview
    await prisma.interview.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting interview:', error)
    return NextResponse.json(
      { error: 'Failed to delete interview' },
      { status: 500 }
    )
  }
}
