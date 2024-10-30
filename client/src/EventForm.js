import React, { useState } from 'react';

const EventForm = () => {
    const [showForm, setShowForm] = useState(false);
    const [event, setEvent] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [events, setEvents] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const start = `${startDate}T${startTime}`;
        const end = `${endDate}T${endTime}`;

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
                setEvents([{ title: event, description, start, end }]);
                setEvent('');
                setDescription('');
                setStartDate('');
                setStartTime('');
                setEndDate('');
                setEndTime('');
                setShowForm(false);
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
        <div className="center-box">
            <h1>Event Management</h1>
            <button onClick={() => setShowForm(true)} className="create-event-btn">Create Calendar Event</button>

            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add Event</h2>
                        {successMessage && <p className="success">{successMessage}</p>}
                        {error && <p className="error">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Event Title</label>
                                <input
                                    type="text"
                                    placeholder="Event Title"
                                    value={event}
                                    onChange={(e) => setEvent(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Event Description</label>
                                <input
                                    type="text"
                                    placeholder="Event Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Start Time</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>End Time</label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="submit-btn">Add Event</button>
                            <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {events.length > 0 && (
                <div className="event-table">
                    <h2>Event Details</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Start Date</th>
                                <th>Start Time</th>
                                <th>End Date</th>
                                <th>End Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event, index) => {
                                const startDateTime = new Date(event.start);
                                const endDateTime = new Date(event.end);
                                return (
                                    <tr key={index}>
                                        <td>{event.title}</td>
                                        <td>{event.description}</td>
                                        <td>{startDateTime.toLocaleDateString()}</td>
                                        <td>{startDateTime.toLocaleTimeString()}</td>
                                        <td>{endDateTime.toLocaleDateString()}</td>
                                        <td>{endDateTime.toLocaleTimeString()}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EventForm;
