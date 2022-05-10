const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// watch for events: CommentCreated
app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    if(type === "CommentCreated") {
        // check if comment contains orange
        const status = data.content.includes('orange') ? 'reject' : 'approved';

        // send the result back to eventbus
        await axios.post('http://localhost:4005/events', {
            type: "CommentModerated",
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        });
    }

    res.send({}); // send a response, otherwise it will pend
});

// listen
app.listen(4003, () => {
    console.log('Listening on 4003');
});