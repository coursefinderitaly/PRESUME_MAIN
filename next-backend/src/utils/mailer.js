const { Resend } = require('resend');
const nodemailer = require('nodemailer');

// ─── Resend Client ─────────────────────────────────────────────────────────────
let resend = null;
try {
    const key = process.env.RESEND_API_KEY;
    if (key && key !== 'your_resend_api_key_here') {
        resend = new Resend(key);
        console.log('[Mailer] Resend client initialized ✓');
    } else {
        console.warn('[Mailer] RESEND_API_KEY missing or placeholder — Resend disabled.');
    }
} catch (err) {
    console.warn('[Mailer] Failed to initialize Resend:', err.message);
}

// ─── Gmail Fallback Transporter ────────────────────────────────────────────────
const createGmailTransporter = () => nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ─── FROM address (your verified domain) ──────────────────────────────────────
const FROM_ADDRESS = 'Presume Overseas <noreply@presumeoverseas.com>';

/**
 * Sends a professional transactional email to a student via Resend.
 * Falls back to Gmail if Resend is not configured or fails.
 *
 * @param {string}   to       Recipient email
 * @param {string}   subject  Email subject
 * @param {string}   html     Full HTML body
 * @param {string}   text     Optional plain text version for anti-spam
 */
const sendStudentEmail = async (to, subject, html, text = '') => {
    // ── PRIMARY: Resend ─────────────────────────────────────────────────────────
    if (resend) {
        try {
            const { data, error } = await resend.emails.send({
                from: FROM_ADDRESS,
                to: [to],
                subject,
                html,
                text: text || _stripHtml(html), // Fallback to stripping HTML if no text provided
            });

            if (error) {
                console.error(`[Resend] Delivery refused for <${to}>:`, error.message);
                console.warn('[Mailer] Falling back to Gmail…');
                return _sendViaGmail(to, subject, html, [], text);
            }

            console.log(`[Resend] Email sent to <${to}> · id=${data?.id}`);
            return;
        } catch (err) {
            console.error(`[Resend] Unexpected error for <${to}>:`, err.message);
            console.warn('[Mailer] Falling back to Gmail…');
            return _sendViaGmail(to, subject, html, [], text);
        }
    }

    // ── FALLBACK: Gmail ─────────────────────────────────────────────────────────
    console.warn('[Mailer] Resend not available — using Gmail fallback.');
    return _sendViaGmail(to, subject, html, [], text);
};

/**
 * Sends internal/administrative emails via personal Gmail (supports attachments).
 *
 * @param {string}   to           Recipient
 * @param {string}   subject
 * @param {string}   html
 * @param {Array}    attachments  Nodemailer attachment objects
 * @param {string}   text         Optional plain text version
 */
const sendAdminEmail = async (to, subject, html, attachments = [], text = '') => {
    if (!process.env.EMAIL_USER) {
        console.warn('[Mailer] EMAIL_USER not set — skipping admin email.');
        return;
    }
    return _sendViaGmail(to, subject, html, attachments, text);
};

// ─── Internal Gmail Helper ─────────────────────────────────────────────────────
const _sendViaGmail = async (to, subject, html, attachments = [], text = '') => {
    if (!process.env.EMAIL_USER) {
        console.warn('[Gmail] EMAIL_USER not set — email skipped.');
        return;
    }

    const transporter = createGmailTransporter();
    try {
        const info = await transporter.sendMail({
            from: `"Presume Overseas" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            text: text || _stripHtml(html),
            attachments,
        });
        console.log(`[Gmail] Email sent to <${to}> · messageId=${info.messageId}`);
    } catch (err) {
        console.error(`[Gmail] Failed to send email to <${to}>:`, err.message);
        throw err;
    }
};

/**
 * Very basic HTML stripper to create a plain-text fallback.
 * Crucial for avoiding spam filters that penalize HTML-only emails.
 */
const _stripHtml = (html) => {
    return html.replace(/<[^>]*>?/gm, '').replace(/\s\s+/g, ' ').trim();
};

module.exports = { sendStudentEmail, sendAdminEmail };
