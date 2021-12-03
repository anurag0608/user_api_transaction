module.exports = {
    validateToken: function (req, res, next) {
            const token = req.headers['x-access-token']
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
                if(err){
                    // console.log(err);
                    res.send("Token not valid or expired!")
                }else{
                    // console.log(decoded);
                    //{ user : ,iat: , exp: , iss}
                    req.user_id = decoded.user_id.toString()
                    next()
                }
            });
    }
}