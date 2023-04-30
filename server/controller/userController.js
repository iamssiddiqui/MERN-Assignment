const userSchema = require("../userSchema/userModel")
const jwt = require("jsonwebtoken")

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };
  
  const isValidBody = function (body) {
    return Object.keys(body).length > 0;
  };

  //create User

  const createUser = async function (req, res) {
    try {
        let data = req.body;
        let nameRegex = /^[a-zA-Z ]{2,30}$/;
        let emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

      if (!isValidBody(data)) {
        return res.status(400).send({status:false, message:"author details required"})
      }

      let { name, phone, email, password } = data;

      if (!isValid(name)) {
        return res.status(400).send({status:false, message:"Name is required"})
      }

      if (!name.match(nameRegex))
        return res.status(400).send({
          status: false,
          msg: "Name should have alphabets only",
        });

      if (!isValid(phone)) {
        return res.status(400).send({ status: false, message: "phone is required" });
      }

      const isMobileNumberAlreadyUsed = await userSchema.findOne({phone}) 
        if (isMobileNumberAlreadyUsed) {
            return res.status(400).send({ status: false, msg: "This mobile number is already registered!"})
        }

      if (!isValid(email)) {
        return res.status(400).send({ status: false, message: "email is required" });
      }

      if (!email.match(emailRegex))
      return res.status(400).send({ status: false, msg: "Email is not legit" });

      const emailInUse = await userSchema.findOne({ email: email })
      if (emailInUse) {
        return res.status(400).send({status:false, message: "email entered is already in use" })
    }

    if (!isValid(password)) {
       return res.status(400).send({status:false, message:"password is required"})
    }

      let savedData = await userSchema.create(data);
      res.status(201).send({status:true, msg: savedData});
    } 
    
    catch (err) {
      res.status(500).send({status:false, message:err.message})
    }
  };

  //login user

  const login = async function (req, res) {
    try {
        let emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  
      const data = req.body;
      if (!isValidBody(data)) {
        return res
          .status(400)
          .send({ status: false, message: "Please provide email and password" });
      }
      let { email, password } = data;
      
      if (!isValid(email)) {
        return res
          .status(400)
          .send({
            status: false,
            message: "email is required ",
          });
      }
      if (!email.match(emailRegex))
        return res.status(400).send({ status: false, msg: "Email is not legit" });
      if (!isValid(password)) {
        return res
          .status(400)
          .send({ status: false, message: "password is required" });
      }
  
      const checkCredentials = await userSchema.findOne({
        email: data.email,
        password: data.password,
      });
      if (!checkCredentials) {
        return res
          .status(400) //401
          .send({ status: false, message: "invalid login data" });
      }
      let token = jwt.sign(
        { userId: checkCredentials._id.toString() },
        "MERNproject"
      );
      res.header("x-api-key", token);
      res.status(200).send({ status: true, token: token });
    } catch (err) {
      res.status(500).send({ status: false, message: err.message });
    }
  };
  

  module.exports.createUser = createUser
  module.exports.login = login;