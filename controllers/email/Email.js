'use strict'

// Email Helper and Templates
import {sendMail} from '../../helpers/email'
// TEMPLATES
import _invitation from './email_templates/invitation'
import _notification from './email_templates/notification'


export async function invitationEmail (to, name, username) {
  // if (process.env.NODE_ENV !== 'production') {
  //   to = ['mariocampbellr@gmail.com', 'pruebasmanoapp@gmail.com']
  // }

  let data = {
    to,
    html: _invitation(name, to, username),
    text: `Invitación de ManoApp para ${name}`,
    subject: `Invitación de ManoApp para ${name}`
  }

  // Send invitation Email
  return sendMail(data)
}

export async function notificationEmail (email, notification) {
  if (process.env.NODE_ENV !== 'production') {
    email = 'mariocampbellr@gmail.com'
  }

  let data = {
    to: email,
    html: _notification(notification),
    text: notification.title,
    subject: notification.title
  }

  // Send Welcome Email
  return sendMail(data)
}

