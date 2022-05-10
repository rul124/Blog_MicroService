const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// create an event constant to store events
const events = [];

// implement for receiving incoming events
app.post('/events', (req, res) => {
    const event = req.body; // we don't know what inside request body

    events.push(event);

    axios.post('http://localhost:4000/events', event).catch((err) => {
        console.log(err.message);
    });
    axios.post('http://localhost:4001/events', event).catch((err) => {
        console.log(err.message);
    });
    axios.post('http://localhost:4002/events', event).catch((err) => {
        console.log(err.message);
    });
    axios.post('http://localhost:4003/events', event).catch((err) => {
        console.log(err.message);
    });

    res.send({status : 'OK'});
});

app.get('/events', (req, res) => {
    // whenever someone ask to get events, send events to them
    res.send(events);
})

app.listen(4005, () => {
    console.log('Listening on 4005')
});