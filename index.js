const path = require("path")
const f = require('fastify')({ logger: { level: 'trace' } })


const redis = require('redis');
const client = redis.createClient({
    socket: {
        host: '127.0.0.1',
        port: 6379
    },
    password: 'w@lkingth3d0g'
});


client.on('connect', err => {
    console.log('Connect Error ' + err);
});
client.on('error', err => {
    console.log('Error ' + err);
});

client.connect();
// var createClient = require('redis')
// var client = createClient({url:'redis://:w@lkingth3d0g@localhost:6379'})
// client.on('error', (err) => console.log('Redis Client Error', err));

f.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/', // optional: default '/'
})

f.get('/', (request, reply) => {
    reply.header('Content-Type', 'application/json')
    reply.send({ hello: "newman" })
})

f.get('/about', (request, reply) => {
    reply.sendFile('about.html')
})

f.get('/super', (request, reply) => {
    reply.header('Content-Type', 'application/json')
    reply.send({ batman: 'sucks' })
})

f.get('/vote/:ballot', (request, reply) => {
    const { ballot } = request.params;
    console.log("Tally a vote for " + ballot)
    // client.set('stuff', ballot);

    client.set('stuffnew', ballot, (err, rep) => {
        if (err) throw err;
        console.log(rep);
    


    client.get('stuffnew', (err, rep) => {
        if (err) throw err;
        console.log(rep);
        // console.log("Redis says " + value)
        reply.sendFile('voted.html')
    })
})

})



// // Run the server!
f.listen({ port: 3000 }, (err) => {
    if (err) {
        f.log.error(err)
        process.exit(1)
    }
})