const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('client')); // Serve static files from the client directory

const PORT = process.env.PORT || 5000;

// Load client secrets from a local file
let credentials;
try {
    credentials = JSON.parse(fs.readFileSync('server/credentials.json'));
} catch (error) {
    console.error("Error reading credentials.json:", error);
}

// Create an OAuth2 client
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Root route
app.get('/', (req, res) => {
    res.send('Google Calendar API Server is running!');
});

// Endpoint to get the auth URL
app.get('/auth/google', (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar'],
    });
    res.json({ url: authUrl });
});

// Endpoint to handle the OAuth callback
app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Save tokens to a secure location (e.g., database)
    res.json(tokens);
});

// Endpoint to create an event
app.post('/create-event', async (req, res) => {
    const { event, tokens } = req.body;
    oAuth2Client.setCredentials(tokens);
    
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    
    calendar.events.insert({
        calendarId: 'primary',
        resource: event,
    }, (err, event) => {
        if (err) return res.status(500).send('Error creating event: ' + err);
        res.json({ success: true, event: event.data });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
