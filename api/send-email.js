export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Méthode non autorisée"
    });
  }

  try {
    const {
      email,
      nom,
      prenom,
      numeroInscription
    } = req.body;

    if (!email || !nom || !prenom || !numeroInscription) {
      return res.status(400).json({
        error: "Informations manquantes"
      });
    }

    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "INMeS <onboarding@resend.dev>",
          to: [email],
          subject: "Confirmation de votre inscription — INMeS",
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
              <h2 style="color:#d63384">
                INMeS contre le Cancer du Sein
              </h2>

              <p>Bonjour <strong>${prenom} ${nom}</strong>,</p>

              <p>
                Nous vous confirmons que votre inscription
                à la campagne de sensibilisation au cancer du sein
                a bien été enregistrée.
              </p>

              <p>
                <strong>Numéro d'inscription :</strong><br>
                ${numeroInscription}
              </p>

              <p>
                <strong>Montant de participation :</strong>
                3 000 F CFA
              </p>

              <p>
                Merci pour votre participation et votre engagement
                dans la lutte contre le cancer du sein.
              </p>

              <p>
                Cordialement,<br>
                <strong>Équipe INMeS</strong>
              </p>
            </div>
          `
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erreur lors de l'envoi du mail"
    });
  }
}
