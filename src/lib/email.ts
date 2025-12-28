import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

const FROM_EMAIL = process.env.FROM_EMAIL || 'OussamAI <noreply@oussamai.com>'

export async function sendInvitationEmail(
  to: string,
  guestName: string,
  weddingName: string,
  weddingDate: Date,
  rsvpUrl: string
) {
  const formattedDate = weddingDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Georgia', serif; margin: 0; padding: 0; background: #FAF5EB; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: white; border-radius: 20px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { width: 60px; height: 60px; background: linear-gradient(135deg, #D4A420, #B8891A); border-radius: 15px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; }
    h1 { color: #D4A420; font-size: 32px; margin: 0; }
    .subtitle { color: #666; font-size: 16px; margin-top: 5px; }
    .content { color: #333; line-height: 1.8; font-size: 16px; }
    .highlight { background: linear-gradient(135deg, #FAF5EB, #FFF); border-left: 4px solid #D4A420; padding: 20px; margin: 25px 0; border-radius: 0 10px 10px 0; }
    .date { font-size: 20px; color: #D4A420; font-weight: bold; }
    .button { display: inline-block; background: linear-gradient(135deg, #D4A420, #B8891A); color: white; padding: 15px 40px; border-radius: 50px; text-decoration: none; font-weight: bold; margin: 25px 0; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
    .heart { color: #D4A420; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">
          <span style="color: white; font-size: 30px;">♥</span>
        </div>
        <h1>${weddingName}</h1>
        <p class="subtitle">Vous êtes invité(e) !</p>
      </div>

      <div class="content">
        <p>Cher(e) <strong>${guestName}</strong>,</p>

        <p>Nous avons l'immense joie de vous convier à célébrer notre union !</p>

        <div class="highlight">
          <p class="date">📅 ${formattedDate}</p>
        </div>

        <p>Votre présence serait pour nous le plus beau des cadeaux. Merci de nous confirmer votre venue en cliquant sur le bouton ci-dessous :</p>

        <div style="text-align: center;">
          <a href="${rsvpUrl}" class="button">Répondre à l'invitation</a>
        </div>

        <p>Nous avons hâte de partager ce moment unique avec vous !</p>

        <p>Avec tout notre amour,<br>
        <span class="heart">♥</span> Les futurs mariés</p>
      </div>

      <div class="footer">
        <p>Cette invitation a été envoyée via OussamAI</p>
        <p>Si vous avez des questions, répondez directement à cet email</p>
      </div>
    </div>
  </div>
</body>
</html>
`

  try {
    if (!resend) {
      console.log('Email non envoyé (Resend non configuré)')
      return { success: false, error: 'Resend non configuré' }
    }
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `💒 Vous êtes invité(e) : ${weddingName}`,
      html,
    })

    return { success: true, data }
  } catch (error) {
    console.error('Erreur envoi email:', error)
    return { success: false, error }
  }
}

export async function sendRsvpReminderEmail(
  to: string,
  guestName: string,
  weddingName: string,
  weddingDate: Date,
  rsvpUrl: string
) {
  const daysUntil = Math.ceil((weddingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Georgia', serif; margin: 0; padding: 0; background: #FAF5EB; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: white; border-radius: 20px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    h1 { color: #722F37; font-size: 28px; text-align: center; }
    .content { color: #333; line-height: 1.8; font-size: 16px; }
    .countdown { background: #722F37; color: white; padding: 20px; border-radius: 15px; text-align: center; margin: 25px 0; }
    .countdown-number { font-size: 48px; font-weight: bold; }
    .button { display: inline-block; background: #D4A420; color: white; padding: 15px 40px; border-radius: 50px; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>⏰ Rappel : ${weddingName}</h1>

      <div class="content">
        <p>Cher(e) <strong>${guestName}</strong>,</p>

        <p>Nous n'avons pas encore reçu votre réponse pour notre mariage !</p>

        <div class="countdown">
          <div class="countdown-number">${daysUntil}</div>
          <div>jours restants</div>
        </div>

        <p>Merci de nous confirmer votre présence dès que possible :</p>

        <div style="text-align: center;">
          <a href="${rsvpUrl}" class="button">Confirmer ma présence</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`

  try {
    if (!resend) {
      console.log('Email non envoyé (Resend non configuré)')
      return { success: false, error: 'Resend non configuré' }
    }
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `⏰ Rappel : N'oubliez pas de répondre - ${weddingName}`,
      html,
    })

    return { success: true, data }
  } catch (error) {
    console.error('Erreur envoi rappel:', error)
    return { success: false, error }
  }
}

export async function sendRsvpConfirmationEmail(
  to: string,
  guestName: string,
  weddingName: string,
  weddingDate: Date,
  status: 'CONFIRMED' | 'DECLINED'
) {
  const isConfirmed = status === 'CONFIRMED'

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Georgia', serif; margin: 0; padding: 0; background: #FAF5EB; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: white; border-radius: 20px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center; }
    .icon { font-size: 60px; margin-bottom: 20px; }
    h1 { color: ${isConfirmed ? '#22C55E' : '#666'}; font-size: 28px; }
    .content { color: #333; line-height: 1.8; font-size: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="icon">${isConfirmed ? '🎉' : '💌'}</div>
      <h1>${isConfirmed ? 'Merci pour votre confirmation !' : 'Réponse enregistrée'}</h1>

      <div class="content">
        <p>Cher(e) <strong>${guestName}</strong>,</p>

        ${isConfirmed
          ? `<p>Nous sommes ravis que vous puissiez être des nôtres pour célébrer notre mariage !</p>
             <p>Nous vous enverrons plus de détails prochainement.</p>
             <p>À très bientôt ! 💒</p>`
          : `<p>Nous avons bien enregistré votre réponse. Nous sommes désolés que vous ne puissiez pas être présent(e).</p>
             <p>Vous serez dans nos pensées ce jour-là. 💕</p>`
        }
      </div>
    </div>
  </div>
</body>
</html>
`

  try {
    if (!resend) {
      console.log('Email non envoyé (Resend non configuré)')
      return { success: false, error: 'Resend non configuré' }
    }
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: isConfirmed
        ? `✅ Confirmation reçue - ${weddingName}`
        : `💌 Réponse enregistrée - ${weddingName}`,
      html,
    })

    return { success: true, data }
  } catch (error) {
    console.error('Erreur envoi confirmation:', error)
    return { success: false, error }
  }
}
