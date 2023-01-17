const express = require("express");

const userRouter = require("./Routers/user");

const port = 3000;

const app = express();

app.use(express.json());

app.get("/", (req,res)=>{
    res.send("Authentication API")
})

app.use("/api",userRouter )

app.listen(port, ()=>{
    console.log("Connected")
});