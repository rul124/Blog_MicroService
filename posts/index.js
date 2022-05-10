const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto'); // randomBytes from Krypto package
const cors = require('cors');
const axios = require('axios');

const app = express();

const posts = {}; // Repository for uploading posts
app.use(bodyParser.json());
app.use(cors());

app.get('/posts', (req, res) => {
    res.send(posts); // send posts as a result if "GET"
});

app.post('/posts', async (req, res) => {
    // If "POST", require the title of the body part and construct the content into posts
    const id = randomBytes(4).toString('hex');
    const {title} = req.body;

    posts[id] = {
        id, title
    };

    await axios.post('http://localhost:4005/events', {
        type: "PostCreated",
        data: {id, title}
    });

    // set a manual status here of 201 which indictaes we just created
    // a resource
    res.status(201).send(posts[id]);
});

// add a new post request handler
app.post('/events', (req, res) => {
    console.log("Received Event", req.body.type);

    // respond the request
    res.send({});
});

app.listen(4000, () => {
    console.log("Listening on 4000");
})