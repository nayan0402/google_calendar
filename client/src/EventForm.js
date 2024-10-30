import React, { useState } from 'react';

const EventForm = () => {
    const [showForm, setShowForm] = useState(false); // Controls form popup visibility
    const [event, setEvent] = useState('');
    const [description, setDescription] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [events, setEvents] = useState([]); // Stores added events

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

                // Add the new event to the events table
                setEvents((prevEvents) => [
                    ...prevEvents,
                    { title: event, description, start, end },
                ]);

                // Clear input fields
                setEvent('');
                setDescription('');
                setStart('');
                setEnd('');
                setShowForm(false); // Close the form popup
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
            <h1>Event Management</h1>
            <button onClick={() => setShowForm(true)}>Create Calendar Event</button>

            {/* Popup Modal */}
            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add Event</h2>
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
                            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Event Table */}
            {events.length > 0 && (
                <div className="event-table">
                    <h2>Event Details</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Start</th>
                                <th>End</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event, index) => (
                                <tr key={index}>
                                    <td>{event.title}</td>
                                    <td>{event.description}</td>
                                    <td>{event.start}</td>
                                    <td>{event.end}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EventForm;
