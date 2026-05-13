/**
 * Presume Overseas — Email Template Engine
 * Unified Premium Glassmorphic Design
 */

const getPremiumEmailTemplate = (content) => {
    const { title, greeting, body, ctaText, ctaLink } = content;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Presume Overseas</title>
    <style>
        /* Base Email Resets */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; }

        @keyframes cinematicPan {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
        }

        .cinematic-container {
            width: 100%;
            background-color: #0a0a0a;
            background-image: url('https://images.unsplash.com/photo-1499346030926-9a72daac6c63?q=80&w=2000&auto=format&fit=crop');
            background-size: cover;
            background-position: center center;
            padding: 60px 20px;
            box-sizing: border-box;
        }

        .glass-card {
            max-width: 480px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 24px;
            padding: 45px 35px;
            text-align: center;
            box-shadow: 0 30px 60px rgba(0,0,0,0.4);
        }

        .logo { max-width: 200px; height: auto; margin-bottom: 30px; }
        h1 { margin: 0 0 15px; font-size: 26px; color: #0f172a; font-weight: 800; letter-spacing: -0.5px; line-height: 1.2; }
        p { margin: 0 0 25px; font-size: 16px; color: #475569; line-height: 1.6; }
        .btn {
            display: inline-block;
            background: #0088ff;
            color: #ffffff !important;
            text-decoration: none;
            padding: 18px 36px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            box-shadow: 0 10px 25px rgba(0, 136, 255, 0.4);
        }
        .footer-text { margin-top: 40px; font-size: 11px; color: rgba(255, 255, 255, 0.5); text-align: center; line-height: 1.8; text-transform: uppercase; letter-spacing: 1.5px; }
        .footer-links a { color: rgba(255, 255, 255, 0.7); text-decoration: underline; margin: 0 10px; }
    </style>
</head>
<body>
    <div class="cinematic-container">
        <div class="glass-card">
            <img src="https://presumeoverseas.com/logo.png" alt="Presume Overseas" class="logo">
            <h1>${title}</h1>
            <p>Hi <strong>${greeting}</strong>,</p>
            <p>${body}</p>
            ${ctaLink ? `<a href="${ctaLink}" class="btn">${ctaText || 'Continue'}</a>` : ''}
        </div>
        <div class="footer-text">
            <strong>Presume Overseas Education (OPC) Pvt. Ltd.</strong><br>
            410, 4th Floor, Apollo Premier, Vijay Nagar, Indore, Madhya Pradesh<br>
            <div class="footer-links" style="margin-top: 15px;">
                <a href="https://presumeoverseas.com/privacy">Privacy Policy</a> | 
                <a href="https://presumeoverseas.com/terms">Terms of Service</a> |
                <a href="{{unsubscribe_url}}">Unsubscribe</a>
            </div>
        </div>
    </div>
</body>
</html>`;
};

const getWelcomeEmailHTML = (firstName, lastName = '') => {
    return getPremiumEmailTemplate({
        title: 'Account Successfully Created',
        greeting: `${firstName} ${lastName}`.trim(),
        body: 'Your profile is initialized. We are ready to begin mapping out your journey to international excellence.',
        ctaText: 'Continue to Dashboard',
        ctaLink: 'https://presumeoverseas.com/dashboard'
    });
};

const getSubmissionEmailHTML = (candidateName) => {
    return getPremiumEmailTemplate({
        title: 'Application Submitted',
        greeting: candidateName,
        body: 'Congratulations! Your application has been successfully submitted to the university. We have received your documents and they are now under review by our experts.',
        ctaText: 'View Status',
        ctaLink: 'https://presumeoverseas.com/dashboard'
    });
};

const getExportEmailHTML = (candidateName) => {
    return getPremiumEmailTemplate({
        title: 'Your Course Export',
        greeting: candidateName,
        body: 'You recently downloaded your selected courses from the Course Finder portal. For your convenience, we have attached the Excel sheet to this email.',
        ctaText: 'Visit Portal',
        ctaLink: 'https://presumeoverseas.com/dashboard'
    });
};

const getPartnerRequestEmailHTML = (data) => {
    const { firstName, lastName, email, companyName, studentUniqueId } = data;
    return getPremiumEmailTemplate({
        title: 'New Partner Request',
        greeting: 'Admin',
        body: `A new partner registration request has been received.<br/><br/>
               <strong>Name:</strong> ${firstName} ${lastName || ''}<br/>
               <strong>Email:</strong> ${email}<br/>
               <strong>Company:</strong> ${companyName || 'N/A'}<br/>
               <strong>ID:</strong> ${studentUniqueId || 'N/A'}<br/><br/>
               Please review the application in the admin portal.`,
        ctaText: 'Admin Portal',
        ctaLink: 'https://presumeoverseas.com/admin'
    });
};

module.exports = { 
    getWelcomeEmailHTML, 
    getPartnerRequestEmailHTML,
    getSubmissionEmailHTML,
    getExportEmailHTML
};
