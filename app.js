const mongoose = require("mongoose");
const express = require("express");
const app = express();

app.use(express.json()); //when post, modify incoming data, between req and res, from json to javascript,  docs.txt - 2
app.use(express.static("./public"));  //use http://localhost:3000/index.html

//CREATE PLAYER
app.post("/api/players", async (req, res) => {
    try{
        if(req.body.name && req.body.group){
            const newPlayer =  await Player.create(req.body);  //Player.create (mongoose) creates new document in collection
            res.status(201).json({
                message: newPlayer.name + " " + newPlayer.group + " er registrert",
            })            
        }else{
            res.status(201).json({
                message: "Fyll inn både navn og gruppe",
            })          
        }
    }catch(err){  //if rejected promise
        res.status(400).json({
            message: "Kunne ikke koble til server",
        })
    }
})

//GET ALL PLAYERS, SORTED BY POINTS
app.get("/api/players", async (req, res) => { 
    try{
        const players = await Player.find().sort({points: -1});  //gets and converts from json to js array of objects
        res.status(200).json({
            status: "success",
            result: players.length,
            data: {
                players
            }
        })
    }catch(err){
        res.status(404).json({
            message: "Får ikke kontakt med server"
        })
    }
})

//GET ALL PLAYERS, SORTED ALPHABETICLY
app.get("/api/players2", async (req, res) => { 
    try{
        const players = await Player.find().sort({name: 1});  //gets and converts from json to js array of objects
        res.status(200).json({
            status: "success",
            result: players.length,
            data: {
                players
            }
        })
    }catch(err){
        res.status(404).json({
            message: "Får ikke kontakt med server"
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

//UPDATE POINTS
app.patch("/api/increasePointsByOne", async (req, res) => {
    try{
        const player = await Player.findOneAndUpdate(req.body, { $inc: { "points": 1 }});
        if(player !== null){
            res.json({
                message: player.name + " er justert til " + (player.points + 1) + " poeng",
            })        
        }else{
            res.json({
                message: "Spiller ikke funnet"
            })
        }        
    }catch(err){
        res.json({
            message: "Får ikke kontakt med server"
        })
    }
})

//DELETE ALL PLAYERS
app.delete("/api/deleteAllPlayers", async(req, res) => {
    try{
        //await Player.deleteOne(req.body);
        const deletedPlayer = await Player.deleteMany(req.body);
        if(deletedPlayer === null){
            res.json({
                status: "Ingen spiller funnet"
            })
        }else{
            res.json({
                message: "Alle spillerene er slettet"
            })                
        }
    
    }catch(err){
        res.json({
            status: "Får ikke kontakt med server"
        })
    }

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

