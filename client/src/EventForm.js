import React, { useState } from 'react';

const EventForm = () => {
    const [event, setEvent] = useState('');
    const [description, setDescription] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://localhost:5000/api/add-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                title: event,
                description: description,
                start: start,
                end: end,
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.message) {
                setSuccessMessage(data.message);
                setEvent('');
                setDescription('');
                setStart('');
                setEnd('');
            } else {
                setError(data.error || 'Failed to add event');
            }
        })
        .catch((error) => {
            console.error('Error adding event:', error);
            setError('An error occurred while adding the event.');
        });
    };

    return (
        <div className="form-container">
            <h1>Add Event</h1>
            {successMessage && <p className="success">{successMessage}</p>}
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Event Title"
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Event Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="datetime-local"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    required
                />
                <input
                    type="datetime-local"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    required
                />
                <button type="submit">Add Event</button>
            </form>
        </div>
    );
};

export default EventForm;
