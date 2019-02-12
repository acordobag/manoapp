'use strict'

import config from '../config'
import nodemailer from 'nodemailer'
import sgTransport from 'nodemailer-sendgrid-transport'

const options = {
  auth: {
    api_user: config.mailSettings.user,
    api_key: config.mailSettings.pass
  }
}

export async function sendMail (data) {
  let to = data.to
  let from = data.from || 'ManoApp <no-reply@manoapp.me>'
  let subject = data.subject || 'ManoApp | Email'
  let text = data.text
  let html = data.html

  if (!to || !text || !html) return new Error('Datos Requeridos, revise la información e intente de nuevo')

  // create reusable transporter object using the default SMTP transport
  let client = nodemailer.createTransport(sgTransport(options))

  let mailOptions = {
    from: from, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html // html body
  }

  if (data.attachment) {
    let attachment = {
      attachments: [
        {   // binary buffer as an attachment
          filename: data.attachment.name,
          content: data.attachment.content,
          encoding: data.attachment.encoding
        }
      ]
    }

    mailOptions = Object.assign(mailOptions, attachment)
  }

  let result = await client.sendMail(mailOptions)

  return result
}

