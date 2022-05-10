const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const req = require('express/lib/request');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/posts/:id/comments', (req, res)=>{
    res.send(commentsByPostId[req.params.id] || []);
});

const commentsByPostId = {}; // it should have key: ID of post; Value: list of comments {id, context}

app.post('/posts/:id/comments', async (req, res)=>{
    // create new comment: generate a comment id randomly
    const commentId = randomBytes(4).toString('hex');
    // pull out context created
    const {content} = req.body;

    const comments = commentsByPostId[req.params.id] || [];
    comments.push({ id: commentId, content, status: "pending" });

    commentsByPostId[req.params.id] = comments;

    await axios.post('http://localhost:4005/events', {
        type: "CommentCreated",
        data : {
            id: commentId, 
            content: content, 
            postId: req.params.id,
            status: "pending"
        }
    })

    // send back array
    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    console.log('Received Event ', req.body.type);

    const { type, data } = req.body;

    if(type === 'CommentModerated') {
        const { postId, id, status, content } = data;
        const comments = commentsByPostId[postId];

        // definea function returning the comment
        const comment = comments.find(comment => {
            return comment.id === id;
        })

        comment.status = status; // update status
        console.log("Comment moderated: ", comment.status);
        
        // update it to eventbus as an event
        await axios.post('http://localhost:4005/events', {
            type: "CommentUpdated",
            data: {
                id,
                postId,
                status,
                content
            }
        })
    }

    res.send({});
});

// put another unique port number
app.listen(4001, ()=>{
    console.log("Listening on 4001")
});