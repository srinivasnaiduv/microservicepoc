const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios');


const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

const HandleEvent = (type, data)=>{

    if (type === "PostCreated"){

        const { id, title} = data;

        posts[id]= {id, title, comments:[]};

        //console.log(posts);

    }

    if (type === "CommentCreated"){
        const {id, content, postid, status} = data;

        const post = posts[postid];

        post.comments.push({id, content, status});
    }

    if (type === "commentupdated"){
        const {id, content, postid, status} = data;

        const post = posts[postid];


        const comment = post.comments.find(comment=>{
            return comment.id === id;
        });

        comment.status = status;
        comment.content = content;
    }

}

app.get("/posts", (req, res)=>{
    res.status(201);
    res.send(posts);

});

app.post("/events", (req, res)=>{

    const {type, data} = req.body;

    HandleEvent(type, data);

    res.send({});
});

app.listen(4002, async ()=>{
    console.log("QUERY SERVICE: listening on port 4002");

    try{
    const res = await axios.get('http://localhost:4005/events');

        for (let event of res.data){
            HandleEvent(event.type, event.data);
        }
    } catch(error){
        console.log(error.message);
    }

});