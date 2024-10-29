import React from 'react';

const SignIn = () => {
    return (
        <div className="sign-in-container">
            <h1>Welcome to the Google Calendar App</h1>
            <a href="http://localhost:5000/auth/google">
                <button style={{ padding: '10px 20px', marginTop: '20px' }}>
                    Sign In with Google
                </button>
            </a>
        </div>
    );
};

export default SignIn;
