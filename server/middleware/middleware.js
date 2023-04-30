const jwt = require('jsonwebtoken')

const authenticate = async function (req, res, next) {
  try {
    let token = req.headers['x-api-key'];
    if (!token) {
      return res.status(400).send({status:false, msg:"Add Token"})
    }
    const decodedToken = jwt.verify(token, "MERNproject")
    if (!decodedToken) {
      return res.status(400).send({status:false,msg:"Invalid Token"})
    }
    req.decodedToken = decodedToken;
    next();
  } catch (err) {
    res.status(500).send({status:false, msg:err.message})
  }
}

module.exports.authenticate = authenticate;