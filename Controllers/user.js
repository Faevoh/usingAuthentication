require("dotenv").config();
const model = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// signup function
const signUp = async(req,res)=>{
    try{
        // extracting the attributes from the req.body
        const {name, email, password} = req.body;

        // capture the new user email
        const checkEmail = await model.user.findOne({
            where: {  email:email}
            
        });

        // check for existence
        if (checkEmail){
            res.status(400).json({
                status: "Failed",
                message: "Email already exists."
            });
        }else{
            // encrypt the user password
            const saltedPassword = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, saltedPassword)

            // generate token
            const generateToken = await jwt.sign({
                name,
                email,
                password,
            }, process.env.JWT_SECRET, {expiresIn: "1d"});

            // user data
            const userData = {
                name,
                email,
                password: hashedPassword,
                token: generateToken
            }

            const newUser = await model.user.create(userData);

            if(!newUser){
                res.status(400).json({
                    status: "Failed",
                    message: "Failed to create user"
                });
            }else{
                res.status(201).json({
                    status: "Success",
                    data: newUser
                });
            }
        }
    }catch(e){
        res.status(400).json({
            status: "Failed",
            message: e.message
        });
    }
};

// Log in
const logIn = async (req, res)=>{
    try{
     const {email, password} = req.body
     const checkEmail = await model.user.findOne({where: { email: email }});
     if(!checkEmail)return res.status(404).json({message: "Not Found"});
     const checkPassword = await bcrypt.compare(password, checkEmail.password);
     if(!checkPassword)return res.status(404).json({message: "Incorrect Email or Password"});

      const generateToken = await jwt.sign({
        email,
        password,
      }, process.env.JWT_SECRET, {expiresIn: "1d"});
      checkEmail.token = generateToken;

      await checkEmail.save();
      
      res.status(201).json({
        message: "Successful login",
        data: checkEmail
      });

    }catch(e){
        res.status(400).json({
            message: e.message
        });
    }
};

// Get all
const getAll = async (req,res)=>{
    try{
        const single =await model.user.findAll();
        res.status(201).json({
            message: "Avaliable Users",
            data: single
        });
    }catch(e){
        res.status(400).json({
            message: e.message
        });
    }
};

// Get one
const getOne = async (req, res)=>{
    try{
        const id = req.params.id;
        const allUser = await model.user.findOne({where: {id: id}});
        res.send(allUser);
    }catch(e){
        res.status(404).json({
            message: e.message
        });
    };
};

// Log out
const logOut = async (req, res)=>{
    try{
    const {email, password} = req.body

    const generateToken = await jwt.sign({
        email,
        password,
    }, process.env.JWT_DESTROY);

    const exit = await model.user.destroy({where:{token: generateToken, email: email, password: password}})

    if(!exit){
     res.status(201).json({
        message: "Successful logOut",
        data: exit
      });
    }else{
        res.send("Can not process log out")
    }

    }catch(e){
        res.status(400).json({
            message: e.message
        });
    }
};

module.exports = {
    signUp,
    getAll,
    logIn,
    getOne,
    logOut
}