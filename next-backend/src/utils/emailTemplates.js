const getPremiumEmailTemplate = (data) => {
    const { title, greeting, body, ctaText, ctaLink } = data;
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} — Presume Overseas</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f0f4f8; color: #1e293b; -webkit-font-smoothing: antialiased; }

        .wrapper { padding: 50px 16px; background: #f0f4f8; }

        /* ── Card ─────────────────────────────────── */
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 28px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.12); }

        /* ── Header ───────────────────────────────── */
        .header {
            background: linear-gradient(150deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%);
            padding: 56px 30px 48px;
            text-align: center;
            position: relative;
        }
        .header-accent-bar { height: 5px; background: linear-gradient(90deg, #d4af37, #f5d782, #d4af37); }
        .logo { width: 190px; height: auto; display: block; margin: 0 auto; filter: drop-shadow(0 6px 18px rgba(0,0,0,0.5)); }
        .header-tagline { display: block; margin-top: 14px; font-size: 12px; letter-spacing: 5px; text-transform: uppercase; color: #d4af37; font-weight: 700; }

        /* ── Congratulations Banner ───────────────── */
        .congrats-banner {
            background: linear-gradient(135deg, #d4af37, #b8860b);
            padding: 18px 30px;
            text-align: center;
        }
        .congrats-banner p { color: #000000; font-size: 15px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; }

        /* ── Body ─────────────────────────────────── */
        .body { padding: 55px 50px; }
        .salutation { font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 18px; }
        .intro { font-size: 17px; color: #334155; line-height: 1.8; margin-bottom: 40px; }

        /* ── Steps ────────────────────────────────── */
        .steps-title { font-size: 13px; font-weight: 900; letter-spacing: 4px; text-transform: uppercase; color: #d4af37; margin-bottom: 24px; }
        .step-item { display: flex; align-items: flex-start; gap: 18px; padding: 22px; border-radius: 16px; background: #f8fafc; border: 1px solid #e2e8f0; margin-bottom: 14px; }
        .step-icon { width: 46px; height: 46px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .step-icon-1 { background: rgba(212, 175, 55, 0.15); }
        .step-icon-2 { background: rgba(59, 130, 246, 0.12); }
        .step-icon-3 { background: rgba(16, 185, 129, 0.12); }
        .step-label { font-size: 14px; font-weight: 900; color: #0f172a; margin-bottom: 4px; }
        .step-desc { font-size: 14px; color: #64748b; line-height: 1.5; }

        /* ── Quote ────────────────────────────────── */
        .quote-section { margin: 45px 0; padding: 40px; background: #0f172a; border-radius: 24px; text-align: center; }
        .quote-mark { font-size: 72px; font-family: Georgia, serif; color: #d4af37; line-height: 0.6; display: block; margin-bottom: 20px; }
        .quote-text { font-style: italic; font-size: 18px; color: #f1f5f9; line-height: 1.65; font-weight: 500; }
        .quote-author { margin-top: 18px; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 4px; color: #d4af37; }

        /* ── CTA ──────────────────────────────────── */
        .cta-section { text-align: center; margin: 45px 0 30px; }
        .btn {
            display: inline-block;
            padding: 20px 60px;
            background: linear-gradient(135deg, #1e1b4b, #312e81);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 16px;
            font-size: 16px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 2px;
            box-shadow: 0 12px 30px rgba(30, 27, 75, 0.35);
        }

        /* ── Closer ───────────────────────────────── */
        .closer { margin-top: 45px; padding-top: 35px; border-top: 1px solid #e2e8f0; }
        .closer p { font-size: 16px; color: #334155; line-height: 1.7; }
        .closer-sign { margin-top: 20px; font-size: 16px; color: #0f172a; font-weight: 700; }
        .closer-sub { font-size: 13px; color: #64748b; font-style: italic; margin-top: 4px; }

        /* ── Dark Mission Footer ──────────────────── */
        .mission-block { padding: 50px; background: #0f172a; text-align: center; }
        .mission-heading { font-size: 13px; color: #d4af37; font-weight: 900; letter-spacing: 5px; text-transform: uppercase; margin-bottom: 16px; }
        .mission-body { font-size: 14px; color: #94a3b8; line-height: 1.9; max-width: 450px; margin: 0 auto; }

        /* ── Legal Footer ─────────────────────────── */
        .legal { padding: 50px 20px; text-align: center; color: #64748b; font-size: 11px; line-height: 2.4; letter-spacing: 0.5px; }
        .legal a { color: #1e1b4b; font-weight: 800; text-decoration: none; border-bottom: 2px solid #d4af37; padding-bottom: 2px; margin: 0 10px; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">

            <!-- ── HEADER ──────────────────────────────── -->
            <div class="header">
                <img src="https://presumeoverseas.com/logo.png" alt="Presume Overseas" class="logo">
                <span class="header-tagline">Your Gateway to Global Education</span>
            </div>
            <div class="header-accent-bar"></div>

            <!-- ── CONGRATS BANNER ────────────────────── -->
            <div class="congrats-banner">
                <p>✈️ &nbsp; You're In! Welcome Aboard &nbsp; ✈️</p>
            </div>

            <!-- ── BODY ───────────────────────────────── -->
            <div class="body">
                <div class="salutation">Dear <strong>${greeting}</strong>,</div>
                <div class="intro">
                    <strong>Congratulations!</strong> Your journey to a global future starts right here.<br><br>
                    We are <strong>thrilled</strong> to have you join <strong>Presume Overseas</strong>. You've officially moved from <em>dreaming about the world</em> to taking the first bold step toward living in it.
                </div>

                <!-- Steps -->
                <div class="steps-title">What's Next?</div>

                <div class="step-item">
                    <div class="step-icon step-icon-1">🎯</div>
                    <div>
                        <div class="step-label">Expert Match</div>
                        <div class="step-desc">We're already reviewing your profile to find your perfect university fit.</div>
                    </div>
                </div>

                <div class="step-item">
                    <div class="step-icon step-icon-2">📬</div>
                    <div>
                        <div class="step-label">Mentor Reach-out</div>
                        <div class="step-desc">Keep an eye on your inbox — a dedicated consultant will contact you soon.</div>
                    </div>
                </div>

                <div class="step-item">
                    <div class="step-icon step-icon-3">🌏</div>
                    <div>
                        <div class="step-label">Explore Your Portal</div>
                        <div class="step-desc">Log in to your portal to see where your ambition can take you.</div>
                    </div>
                </div>

                <!-- Quote -->
                <div class="quote-section">
                    <span class="quote-mark">&ldquo;</span>
                    <p class="quote-text">The world is a book, and those who do not travel read only one page.</p>
                    <div class="quote-author">— Saint Augustine</div>
                </div>

                <!-- CTA -->
                <div class="cta-section">
                    ${ctaLink ? `<a href="${ctaLink}" class="btn">${ctaText || 'Go to My Portal'}</a>` : ''}
                </div>

                <!-- Closer -->
                <div class="closer">
                    <p>We're here to help you write the most exciting chapter of your life.<br><strong>Let's make it happen!</strong></p>
                    <div class="closer-sign">The Presume Overseas Team</div>
                    <div class="closer-sub">Your Gateway to Global Education</div>
                </div>
            </div>

            <!-- ── DARK MISSION BLOCK ──────────────────── -->
            <div class="mission-block">
                <div class="mission-heading">Our Promise</div>
                <div class="mission-body">From your first consultation to your first day on campus abroad, Presume Overseas is your lifelong partner in global excellence. We don't just find universities — we open worlds.</div>
            </div>

        </div>

        <!-- ── LEGAL FOOTER ───────────────────────── -->
        <div class="legal">
            <strong>PRESUME OVERSEAS EDUCATION (OPC) PVT. LTD.</strong><br>
            410, Apollo Premier, Vijay Nagar, Indore, Madhya Pradesh, India<br>
            <div style="margin-top: 20px;">
                <a href="https://presumeoverseas.com/privacy">Privacy Policy</a>
                <a href="https://presumeoverseas.com/terms">Terms of Service</a>
            </div>
        </div>
    </div>
</body>
</html>`;
};

const getWelcomeEmailHTML = (candidateName) => {
    return getPremiumEmailTemplate({
        title: "You're In! Welcome to Presume Overseas",
        greeting: candidateName,
        body: '',
        ctaText: 'Go to My Portal',
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
               ${companyName ? `<strong>Company:</strong> ${companyName}<br/>` : ''}
               ${studentUniqueId ? `<strong>Reference ID:</strong> ${studentUniqueId}<br/>` : ''}`,
        ctaText: 'Review Request',
        ctaLink: 'https://presumeoverseas.com/admin'
    });
};

const getAdminCredentialsEmailHTML = (data) => {
    const { firstName, email, password } = data;
    return getPremiumEmailTemplate({
        title: 'Admin Access Granted',
        greeting: firstName,
        body: `Your administrative account has been created successfully. Use the following credentials to log in:<br/><br/>
               <strong>Email:</strong> ${email}<br/>
               <strong>Password:</strong> ${password}<br/><br/>
               Please change your password after your first login for security.`,
        ctaText: 'Admin Login',
        ctaLink: 'https://presumeoverseas.com/admin'
    });
};

const getInquiryNotificationEmailHTML = (data) => {
    const { name, email, phone, message, subject } = data;
    return getPremiumEmailTemplate({
        title: 'New Website Inquiry',
        greeting: 'Admin',
        body: `A new inquiry has been submitted via the website contact form.<br/><br/>
               <strong>From:</strong> ${name}<br/>
               <strong>Email:</strong> ${email}<br/>
               <strong>Phone:</strong> ${phone}<br/>
               <strong>Subject:</strong> ${subject || 'General Inquiry'}<br/>
               <strong>Message:</strong><br/>${message}`,
        ctaText: 'View in Panel',
        ctaLink: 'https://presumeoverseas.com/admin'
    });
};

module.exports = {
    getPremiumEmailTemplate,
    getWelcomeEmailHTML,
    getExportEmailHTML,
    getPartnerRequestEmailHTML,
    getAdminCredentialsEmailHTML,
    getInquiryNotificationEmailHTML
};
