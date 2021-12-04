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