const mongoose = require("mongoose");
const express = require("express")
const app = express()

app.use(express.json()); //when post, modify incoming data, between req and res, from json to javascript,  docs.txt - 2
app.use(express.static("./public"));  //use http://localhost:3000/index.html

//CREATE PLAYER
app.post("/api/players", async (req, res) => {
    try{
        const newPlayer =  await Player.create(req.body);  //Player.create (mongoose) creates new document in collection
        res.status(201).json({
            status: "success",
            data: {
                player: newPlayer
            },

        })
    }catch(err){  //if rejected promise
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
})

//GET ALL PLAYERS
app.get("/api/players", async (req, res) => { 
    try{
        const players = await Player.find();  //gets and converts from json to js array of objects
        res.status(200).json({
            status: "success",
            result: players.length,
            data: {
                players
            }
        })
    }catch(err){
        res.status(404).json({
            status: "Får ikke kontakt med server",
            message: err
        })
    }
})

//DELETE PLAYER
app.delete("/api/deletePlayer", async(req, res) => {
    try{
        //await Player.deleteOne(req.body);
        const deletedPlayer = await Player.findOneAndDelete(req.body);
        if(deletedPlayer === null){
            res.json({
                status: "Ingen spiller funnet"
            })
        }else{
            res.json({
                name: req.body.name,
                status: "Spiller er slettet"
            })                
        }
    
    }catch(err){
        res.json({
            status: "Får ikke kontakt med server"
        })
    }

})

//GET PLAYER
app.get("/api/getPlayer", async (req, res) => {
    const player = await Player.findOne(req.body);
    if(player === null){
        res.json({
            status: "Spiller er ikke funnet"
        })
    }else{
        res.json({
            status: "Spiller er funnet"
        })
    }
})

//UPDATE POINTS
app.patch("/api/updatePoints", async (req, res) => {
    await Player.findOneAndUpdate(req.body, {points: 5});
})

//SERVER
app.listen(3000, () => {
    console.log("listening on port 3000")
})

//MONGOOSE
const DB = "mongodb+srv://martineinum:M314E159@cluster0.bco3e.mongodb.net/chesslog?retryWrites=true&w=majority";

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(con => { //con is an object, the resolved promise
    console.log("DB connection successful");
})


const playerSchema = new mongoose.Schema({
    name: {
        type: String
    },
    group: {
        type: String
    },
    points: {
        type: Number
    }
})


const Player = mongoose.model("Player", playerSchema);

