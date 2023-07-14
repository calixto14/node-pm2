const express = require("express");
const amqp = require("amqplib");
var channel, connection;  
const app = express();
const PORT = process.env.PORT || 4001;
app.use(express.json());
app.get("/send-msg", async(req, res) => {
    await sendData({log : "ok"})
    res.send("Hello world")
});

app.get("/send-other", async(req, res)=>{
    await sendData("test-queue2", {log : "ok2"})
    res.send("another endpoint")
})
app.listen(PORT, async() => {
    await connectQueue();
    console.log("Server running at port " + PORT)
});


async function connectQueue() {   
    try {
        connection = await amqp.connect("amqp://localhost:5672");
        channel    = await connection.createChannel()
        
        await channel.assertQueue("test-queue")
        
    } catch (error) {
        console.log(error)
    }
}

async function sendData (queue,data) {
    // send data to queue
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
        
    // close the channel and connection
    // await channel.close();
    // await connection.close(); 
}