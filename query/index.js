const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

// QUICK EXAMPLE
// posts == {
//     'jsdas': {id : 'jsdas', title: 'post title', comments : [{id : "xasxs", content : 'comment'}]}
// }

const handleEvent = ( type, data ) => {
    // take a look at type
    if (type === "PostCreated") {
        const {id, title} = data;
        posts[id] = {id, title, comments : []} // initialize the contents in posts
    }

    if (type === "CommentCreated") {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        // append comment list into post with postId
        post.comments.push({id, content, status}); 
    }

    if (type === "CommentUpdated") {
        const {id, content, postId, status} = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return comment.id === id;
        });
        comment.status = status;
        comment.content = content;
    }
};

app.get('/posts', (req, res) => {
    res.send(posts);
});

// receive event from event bus
app.post('/events', (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);

    res.send({});
});

app.listen(4002, async () => {
    console.log("Listening on 4002");
    try {
        const res = await axios.get("http://localhost:4005/events"); // ask for events from event bus
   
        for (let event of res.data) {
            console.log("Processing event:", event.type);

            handleEvent(event.type, event.data);
        }
    } catch (error) {
        console.log(error.message);
    }
});