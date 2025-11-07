const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 3000;




// Middlewares
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('tiny'));

// Basic rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per windowMs
});
app.use('/api/', apiLimiter);

// Serve the frontend static files (expects frontend built or static files in ../frontend)
const frontendPath = path.join(__dirname, '..', 'frontend');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
}

// Serve the dad folder static files
const dadPath = path.join(__dirname, '..', '..', 'dad');
if (fs.existsSync(dadPath)) {
  app.use('/dad', express.static(dadPath));
}

// Simple API: health and demo data
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the upgraded backend!', env: process.env.NODE_ENV || 'development' });
});




// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email and message are required' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'invalid email' });
  }

  const entry = {
    id: Date.now(),
    name,
    email,
    message,
    receivedAt: new Date().toISOString(),
  };

  // Append to a local file (simple persistence). In production, wire to a DB or mail service.
  const storageDir = path.join(__dirname, 'data');
  if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });
  const file = path.join(storageDir, 'contacts.jsonl');
  fs.appendFile(file, JSON.stringify(entry) + '\n', (err) => {
    if (err) console.error('Failed to save contact', err);
  });

  // Send email using Gmail with alternative SMTP configuration
  try {
    console.log('Attempting to send email using Gmail SMTP...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS.replace(/\s/g, ''), // remove any spaces from app password
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: 'judeandco@gmail.com',
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    };

    console.log('Mail options:', JSON.stringify(mailOptions, null, 2));

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    res.json({ success: true, message: 'Thanks — your message was received and email sent.' });
  } catch (error) {
    console.error('Failed to send email:', error);
    res.json({ success: true, message: 'Thanks — your message was received, but email delivery failed.' });
  }
});


// Fallback to index.html (for SPA or static site routing) - use middleware to avoid route parsing issues
app.use((req, res) => {
  const indexFile = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexFile)) return res.sendFile(indexFile);
  res.status(404).send('Not Found');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.close(() => process.exit(0));
});
