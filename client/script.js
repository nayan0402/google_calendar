document.getElementById('google-signin').onclick = async () => {
    const response = await fetch('http://localhost:5000/auth/google');
    const { url } = await response.json();
    window.location.href = url;
};

window.onload = async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
        const response = await fetch(`http://localhost:5000/auth/google/callback?code=${code}`);
        const tokens = await response.json();
        localStorage.setItem('tokens', JSON.stringify(tokens));
        document.getElementById('create-event').style.display = 'block';
    }
};

document.getElementById('create-event-button').onclick = () => {
    document.getElementById('event-popup').style.display = 'block';
};

document.getElementById('submit-event').onclick = async () => {
    const eventName = document.getElementById('event-name').value;
    const eventDatetime = document.getElementById('event-datetime').value;
    
    const event = {
        summary: eventName,
        start: {
            dateTime: new Date(eventDatetime).toISOString(),
            timeZone: 'America/Los_Angeles', // Change to your time zone
        },
        end: {
            dateTime: new Date(new Date(eventDatetime).getTime() + 60 * 60 * 1000).toISOString(),
            timeZone: 'America/Los_Angeles',
        },
    };

    const tokens = JSON.parse(localStorage.getItem('tokens'));
    const response = await fetch('http://localhost:5000/create-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, tokens }),
    });
    const data = await response.json();
    
    if (data.success) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `<td>${eventName}</td><td>${new Date(eventDatetime).toLocaleString()}</td>`;
        document.getElementById('event-list').appendChild(newRow);
        alert('Event created successfully!');
    } else {
        alert('Error creating event: ' + data.error);
    }
};
