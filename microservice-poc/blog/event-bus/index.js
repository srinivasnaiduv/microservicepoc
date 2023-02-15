const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express();

app.use(bodyParser.json());

const events = [];

app.get("/events", (req, res)=>{
    res.send(events);
});

app.post("/events", async (req, res)=>{

    const event = req.body;

    events.push(event);

    console.log(req.body);

    await axios.post("http://localhost:4000/events", event).catch(()=>{});
    await axios.post("http://localhost:4001/events", event).catch(()=>{});
    await axios.post("http://localhost:4002/events", event).catch(()=>{});
    await axios.post("http://localhost:4003/events", event).catch(()=>{});


    res.send({status:"OK"});
});

app.listen(4005, ()=>{
    console.log("EVENT BUS SERVICE: Listening on port 4005");
});