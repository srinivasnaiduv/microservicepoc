const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const {randomBytes} = require('crypto')
const exp = require('constants')

const app = express();

app.use(bodyParser.json());

const commentsbypostid = {};

app.get("/post/:id/comment", (req, res)=>{

    res.send(commentsbypostid[req.params.id] || []);

});

app.post("/post/:id/comment", async (req, res)=>{

    const commentid = randomBytes(4).toString("hex");

    const {content} = req.body;

    const comments = commentsbypostid[req.params.id] || [];

    comments.push({id:commentid,content, status:'pending'});

    await axios.post("http://localhost:4005/events",{
        type:"CommentCreated",
        data:{
            id:commentid,
            content,
            postid:req.params.id,
            status:'pending'

        }
    });

    commentsbypostid[req.params.id] = comments;

    res.status(201).send(comments);

});

app.post("/events", async (req, res)=>{

    console.log("event has been received " + req.body.type);

    const {type, data} = req.body;

    if (type ==='commentmoderated'){
        const{id, postid, status} = data;

        const comments = commentsbypostid[postid];

        const comment = comments.find(comment =>{
            return comment.id === id;
        });

        comment.status = status;

        await axios.post('http://localhost:4005', {
            type: 'commentupdated',
            data:{
                id,
                status,
                postid,
                content
            }
        })
    }

    res.send({});

});

app.listen(4001, ()=>{
    console.log("COMMENTS SERVICE: Listening on port 4001");
})

