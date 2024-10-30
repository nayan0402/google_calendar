
# Google Calendar Event Manager 

The given web application allows users to sign in with their google email and then add events to their Google Calendar. It also displays the Event added in a table format.

## Installation

To install and run application, follow the given steps-

### Step 1: Clone the Repository
First, clone the Krypt project repository from GitHub to your local machine.
```bash
https://github.com/nayan0402/google_calendar.git
```
### Step 2: Enable the API
Before using Google APIs, you need to turn them on in a Google Cloud project. You can enable one or more APIs in a single Google Cloud project.

1. In the **Google Cloud Console**, enable the **Google Calendar API**.

#### Configure the OAuth Consent Screen
If you're using a new Google Cloud project to complete this quickstart, configure the OAuth consent screen and add yourself as a test user. If you've already completed this step for your Cloud project, skip to the next section.

1. In the **Google Cloud Console**, go to `Menu` > `APIs & Services` > `OAuth consent screen`.
2. For **User type**, select **External**, then click **Create**.
3. Complete the app registration form, then click **Save and Continue**.
4. **Add the required OAuth 2.0 scopes for Google API access**

    **Scope to see your primary Google Account email address**
    ="https://www.googleapis.com/auth/userinfo.email"

    **Scope to see your personal info, including any personal info you've made publicly available**
   ="https://www.googleapis.com/auth/userinfo.profile"

   **Scope to associate you with your personal info on Google**
   ="openid"

   **Scope to see, edit, share, and permanently delete all the calendars that you can access using Google Calendar**
   ="https://www.googleapis.com/auth/calendar"

6. Review your app registration summary. To make changes, click **Edit**. If the app registration looks OK, click **Back to Dashboard**.

#### Authorize Credentials for a Desktop Application
To authenticate end users and access user data in your app, you need to create one or more OAuth 2.0 Client IDs. A client ID is used to identify a single app to Google's OAuth servers. If your app runs on multiple platforms, you must create a separate client ID for each platform.

> **Caution:** This quickstart must be run locally and with access to a browser. It doesn't work if run on a remote terminal such as Cloud Shell or over SSH.

1. In the **Google Cloud Console**, go to `Menu` > `APIs & Services` > `Credentials`.
2. Click **Create Credentials** > **OAuth client ID**.
3. Click **Application type** > **Desktop app**.
4. In the **Name** field, type a name for the credential. This name is only shown in the Google Cloud console.
5. Click **Create**. The OAuth client created screen appears, showing your new **Client ID** and **Client Secret**.
6. Click **OK**. The newly created credential appears under **OAuth 2.0 Client IDs**.
7. Save the downloaded JSON file as `credentials.json`, and move the file to your server directory.

### Step 3: Run the server
Now you should run the backend server. To do this open a new terminal and follow the instructions.
``` bash 
cd server
node server.js
```
This will run your backend server on localhost:5000.

### Step 4: Install dependencies
Now you should install dependencies using npm or yarn for react app. Make sure you have Node.js and npm installed in your system.  
``` bash
cd client
npm install
```
This will install all the dependencies.

### Step 5: Run the Development Server
```bash
npm start
```
This will start the React application and redirect you to local host site automatically.
  

## Features

The application offers a range of features-
- **Google SignIn**: Sign in using your google email account at the tip of your fingertips..

- **Add Event to Google Calender**: Easily add the event to your own google Calendar with ease.

- **Event Table**: The added Events are displayed on the application in a tabular format.


## Site Demo
Here is a recording of the application in use. Click [here](https://drive.google.com/file/d/1MPZC0la9Th2t9Q3CrVqD4OMNGUVNmYuZ/view).

