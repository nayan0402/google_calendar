const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { google } = require('googleapis');
const User = require('./models/User');

const app = express();
const PORT = 5000;

// Middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000', // Adjust this if your client is served from a different URL
    credentials: true
}));

// Serve static files (if you have any)
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: true,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Load credentials
const credentialsPath = path.join(__dirname, 'credentials.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

// Passport Google OAuth configuration
passport.use(new GoogleStrategy({
    clientID: credentials.installed.client_id,
    clientSecret: credentials.installed.client_secret,
    callbackURL: credentials.installed.redirect_uris[0],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        
        if (user) {
            user.accessToken = accessToken;
            if (refreshToken) user.refreshToken = refreshToken;
            await user.save();
        } else {
            user = new User({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                accessToken: accessToken,
                refreshToken: refreshToken || null,
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        console.error('Error in Google Strategy:', err);
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Root route
app.get('/', (req, res) => {
    res.send(`
        <div style="text-align:center; margin-top: 20%;">
            <h1>Welcome to the Google Calendar App</h1>
            <a href="/auth/google"><button style="padding: 10px 20px;">Login with Google</button></a>
        </div>
    `);
});

// Google Auth routes
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']
}));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('http://localhost:3000/add-event');
    }
);

// Add event form
app.post('/api/add-event', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).json({ error: 'User not authenticated' });
    }

    const { title, description, start, end } = req.body;

    // OAuth2 client for Google Calendar API
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ 
        access_token: req.user.accessToken, 
        refresh_token: req.user.refreshToken 
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    try {
        const event = {
            summary: title,
            description: description,
            start: {
                dateTime: new Date(start).toISOString(),
                timeZone: 'America/Los_Angeles', // Change as needed
            },
            end: {
                dateTime: new Date(end).toISOString(),
                timeZone: 'America/Los_Angeles', // Change as needed
            },
        };

        await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });

        res.json({ message: 'Event added to Google Calendar successfully!' });
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ error: 'Failed to add event to Google Calendar' });
    }
});

// Catch-all route for 404 errors
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
