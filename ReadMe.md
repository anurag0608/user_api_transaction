## USER MONEY TRANSACTION API
### This app is made using NodeJS, Express and MongoDB
### Supported features
- Token based authentication using JWT tokens
- All transactions follow ACID (Atomicity, Consistency, Isolation, Durability) properties. More Details: https://www.mongodb.com/basics/acid-transactions
- Scalable design, used NodeJS clustering.
More Details: https://blog.appsignal.com/2021/02/03/improving-node-application-performance-with-clustering.html
- Supported currencies `['INR','USD','EUR']`, if currency is not specified during transaction the default transaction will be in `'USD'`
- Regardless of what user's currency is (for example: my default transaction currency is `'INR'`), one can easily transfer money in any currency.
For example: I want to transfer money to a user in `USD`, If I had `Rs 100` in my account and I want to transfer `1$`, then `1$` will be converted to equivalent `INR` and will be deducted from my account. Similarly, the person whom I'm transferring money, if he receives money in `EUR` then `1$` will bee converted to equivalent `EUR` and will be credited to target user's account.
- Currency conversion is done using https://www.currencyconverterapi.com/. For free version it allows **100 Requests/hour**.
## Note :
```diff 
- You can test this application and do 100 transaction per hour (because I'm using free currency converter API).

+ This App is actually capable of receiving and handling thousands of transaction requests/sec
```

## **How to run ?**
> Go to the root directory, run the following commands

> npm install 

>  node master.js </br> 

- *This will create multiple instances of the api server ( using  clustering )*

## API Documentation
[/register](#register)</br>
[/login](#login)</br>
[/transaction](#post-transaction)</br>
[/getCurrentUser](#get-currentUser)</br>
[/getCurrentUser/stats](#get-currentUser-stats)</br>

#### **All request body parameters are `x-www-form-urlencoded`** 
</br>
<h2 id='register'>POST <span style="color:#ecde60">/register<span></h2>
For user account creation </br>

Request body {  </br>
     `username`: String, </br>
     `password`:  String (length must be >= 8), </br>
     `initialBalance`: Number [ `Optional`, default is 0 ] </br>
     `currency`:  String [ `Optional` ] ( *Supported Currencies*: [ `INR`, `USD`, `EUR` ], default is `USD` if argument not provided )

}

<h2 id='login'>POST <span style="color:#ecde60">/login<span></h2>

**Request body** {  </br>
     `username`: String, </br>
     `password`:  String </br>
}

**Response body** { </br>
    `access_token` : String </br>
} </br>
### The above access token should  be provided in **Request Header** to access `protected routes`. </br>

## **Request Header**
> ### `x-access-token` :  access_token

</br>

# **Protected Routes**
- *Requires `x-access-token` in Http headers*
</br>

<h2 id='post-transaction'>POST <span style="color:#ecde60">/transaction<span></h2>

**Request body**{ </br>
    `amount` : Number, </br>
    `curreny` : String [ `Optional`, default `USD` ] (*Supported currencie*s [ `INR`, `USD`, `EUR` ] ), </br>
    `amount` : Number, </br>
    `to_user` : String (*receiver's username*) </br>
} </br>
**Response body**{ </br>
    `from` : Sender's Object ID, </br>
    `to` : Receiver's Object ID, </br>
    `curreny` : String, </br>
    `timestamp` : Date </br>
} </br>

<h2 id='get-currentUser'>GET <span style="color:#ecde60">/getCurrentUser<span></h2>

- For `debugging` purpose </br> 
##
**Response body**{ </br>
    `username` : String,</br>
    `password` : String (*hashed password*), </br>
    `intial_balance` : Number, </br>
    `net_balance` : Number, </br>
    `amount_credited` : Number, </br>
    `amount_debited` : Number, </br>
    `transaction` : Array of all transaction's ID, </br>
    `currency` : String </br>
} </br>

<h2 id='get-currentUser-stats'>GET <span style="color:#ecde60">/getCurrentUser/stats<span></h2>

**Response body**{ </br>
    `initialBalance` : Number, </br>
    `net_balance` : Number, </br>
    `amount_credited` : Number, </br>
    `amount_debited` : Number, </br>
    `currency` : String </br>
} </br>
