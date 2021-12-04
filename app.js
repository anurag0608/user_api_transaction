module.exports = async ()=>{
    const express = require('express');
    app = express(),
    cors =  require('cors'),
    bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken'),
    User = require('./models/User'),
    bcrypt = require('bcrypt'),
    transactionRouter = require('./routes/transactionRouter'),
    { validateToken } = require('./middleware/validate_token'),
    dotenv = require('dotenv');
    dotenv.config(); // load env variables
    
    // connect to mongoDB
    require('./models/connection')
    
    
    app.use(bodyParser.urlencoded({extended:true}))
    
    app.use('/transaction', validateToken, transactionRouter)
    
    app.get('/', validateToken, async (req,res)=>{
        const current_user_id = req.user_id
        const user = await User.findById(current_user_id).catch(err=>{
            res.send(err)
            return
        })
        res.send("Welcome to the bank!" + user.username)
    })
    app.get('/getCurrentUser',validateToken,async (req, res)=>{
        const user = await User.findById(req.user_id).catch(err=>{
            res.send("No such user!")
            return
        })
        res.send(user)
    })
    app.get('/getCurrentUser/stats',validateToken, async (req, res)=>{
        const user = await User.findById(req.user_id).catch(err=>{
            res.send("No such user!")
            return
        })
        res.send({
            initialBalance: user.initial_balance,
            net_balance: user.net_balance,
            amount_credited: user.amount_credited,
            amount_debited: user.amount_debited,
            currency: user.currency
        })
    })
    app.post('/register', async (req, res)=>{
        if(!req.body.username || !req.body.password){
            res.send("Invalid username or password")
            return
        }
        const username = req.body.username.trim().toLowerCase(),
        plaintextPassword = req.body.password.trim(),
        initialBalance = req.body.initialBalance == undefined ? 0:req.body.initialBalance.trim();
        if(!username || !plaintextPassword){
            res.send("username or password cannot be empty")
            return
        }
        if(plaintextPassword.length < 8){
            res.send("Password must be at least 8 characters long!")
            return
        }
        User.find({username: username}, async (err, user)=>{
            if(err)
                res.send(err)
            if(user.length==0){
                // no such user found
                const new_user = new User();
                new_user.username = username;
                new_user.currency = req.body.currency==undefined?"USD":req.body.currency.trim().toUpperCase()
                new_user.net_balance = initialBalance;
                new_user.initial_balance = initialBalance
                const salt = await bcrypt.genSalt(10)
                new_user.password = await bcrypt.hash(plaintextPassword, salt)
                User.create(new_user,(err, User_created)=>{
                    if(err){
                        res.send(err)
                    }else{
                        //redirect to login route
                        // console.log(User_created)
                        res.status(200).send("User created successfully")
                    }
                })
            }else{
                res.send("User already exists")
            }
        })
        
    })
    app.post('/login', async (req, res)=>{
        const username = req.body.username.trim().toLowerCase(),
        plaintextPassword = req.body.password.trim();
        if(!username || !plaintextPassword){
            res.send("username or password cannot be empty")
            return
        }
        const user = await User.findOne({username: username})
        if(user){
            const isMatch = await bcrypt.compare(plaintextPassword, user.password)
            if(isMatch){
                // generate token
                const payload = { user: username, user_id: user._id};
                const options = { expiresIn:"900000ms", issuer: 'AxDu', algorithm:'HS512' }; // 15 minutes
                const secret = process.env.JWT_SECRET;
                const token = jwt.sign(payload, secret, options)
                res.status(200).send({access_token: token})
            }else{
                res.status(401).send("Password incorrect")
            }
        }else{
            res.send("User not found")
        }
    })
    
    app.listen(process.env.PORT, ()=>{
        console.log("Server is running on port "+process.env.PORT)
    })
}
