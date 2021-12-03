const cluster = require('cluster')
const os = require('os')
const colors = require('colors')
const expressServer = require('./app.js')

//  check if current prcess is master
if(cluster.isMaster){
    console.log(`Master ${process.pid} is running`.blue)
    //  get the number of cpu cores
    const cpuCount = os.cpus().length
    //  create a worker for each cpu core
    for(let i = 0; i < cpuCount; i++){
        cluster.fork()
    }
}else{
    // not a master  process, so we'll just spawn the express server
    expressServer()
    console.log(`Worker ${process.pid} started`.grey)
}
// cluster API
// create a new process if a worker dies
cluster.on('exit',(worker)=>{
    console.log(colors.red(`Worker ${worker.id} died`))
    console.log(colors.green('Starting a new worker..'))
    cluster.fork()
})