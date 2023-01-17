const model = require("../models");
const jwt = require("jsonwebtoken");

const authorization = async (req, res)=>{
    const id = req.params.id;
    const user = await model.user.findAll({where: {id: id}});
    const token = user.token

    if(!token){
        res.status(404).json({
            message: "you are not authenticated"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err,user)=>{
        if(err)return res.status(404).json({message: "Token is not valid"});
        req.user = user
    });
};


module.exports = {
    authorization
}