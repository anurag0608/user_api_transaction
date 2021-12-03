const express = require('express'),
Transaction = require('../models/Transaction'),
conn = require('../models/connection'),
User = require('../models/User'),
axios = require('axios'),
router = express.Router({mergeParams: true});

router.post('/',async (req,res)=>{
    if(req.body.amount < 0)
        res.send("Amount cannot be negative");
    else{
        const transaction_currency = req.body.currency==undefined? "USD":req.body.currency;
        const to_user = await User.findOne({username: req.body.to_user.toLowerCase()})
        const from_user = await User.findOne({_id: req.user_id}).catch(err=>{
            res.send("Invalid LoggedIn User!");
            return
        });
        if(to_user._id.toString() == from_user._id.toString()){
            res.send("Cannot send money to yourself");
            return
        }
         // convert transaction_currency to receiver and sender's currency
        const field_from = `${transaction_currency}_${from_user.currency}`
        const field_to = `${transaction_currency}_${to_user.currency}`

        // console.log(field_from+" "+field_to)

        let converted_amt_from,converted_amt_to;
    
        converted_amt_from = await axios.get(`https://free.currconv.com/api/v7/convert?q=${transaction_currency}_${from_user.currency}&compact=ultra&apiKey=${process.env.CURRENCY_API_KEY}`)
                             .catch(err=>{
                                res.send(err);
                                return
                             })
        converted_amt_to = await axios.get(`https://free.currconv.com/api/v7/convert?q=${transaction_currency}_${to_user.currency}&compact=ultra&apiKey=${process.env.CURRENCY_API_KEY}`)
                          .catch(err=>{
                            res.send(err);
                            return
                          })
     
        if(converted_amt_from.data[field_from] == undefined || converted_amt_to.data[field_to] == undefined){
            res.send("Invalid Currency");
            return
        }
        converted_amt_from = converted_amt_from.data[field_from]*req.body.amount
        converted_amt_to = converted_amt_to.data[field_to]*req.body.amount
        
        // console.log(converted_amt_from+" "+converted_amt_to)

        if(from_user.net_balance < converted_amt_from){
            res.send("Insufficient balance");
            return
        }
        else if(to_user){
            const newTransaction = new Transaction({
                from: req.user_id,
                to: to_user._id.toString(),
                amount: req.body.amount,
                currency: transaction_currency
            });
            const session = await conn.startSession() // start transaction session
            try{
                session.startTransaction(); // start new transaction
                const transactionResult = await newTransaction.save({session});

                to_user.net_balance += converted_amt_to;
                to_user.amount_credited += converted_amt_to;
                to_user.transactions.push(transactionResult._id);

                await to_user.save({session})
                
                from_user.net_balance -= converted_amt_from;
                from_user.amount_debited += converted_amt_from;
                from_user.transactions.push(transactionResult._id);
                
                await from_user.save({session})

                await session.commitTransaction(); // commit all operations

                res.status(200).send({Status:"Success",transactionResult});

            }catch(err){
                await session.abortTransaction(); // rollback all operations
                res.send('Error in processing transaction'+err);
            }finally{
                await session.endSession();
            }
            // non transactional code
            // newTransaction.save().then(async transaction=>{
               
            //     to_user.net_balance += transaction.amount;
            //     to_user.amount_credited += transaction.amount;
            //     to_user.transactions.push(transaction._id);

            //     await to_user.save().catch(err=>res.send(err));
                
            //     from_user.net_balance -= transaction.amount;
            //     from_user.amount_debited += transaction.amount;
            //     from_user.transactions.push(transaction._id);
                
            //     await from_user.save().catch(err=>res.send(err));
                
            //     res.status(200).send({Status:"Success",transaction});
            // }).catch(err=>{
            //     res.send('Error in processing transaction');
            // });
        }else{
            res.status(404).send('Target user not found')
        }
    }
})

module.exports = router