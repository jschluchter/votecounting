const path = require("path")
const f = require('fastify')({ logger: { level: 'trace' } })

const redis = require('redis')

const client = redis.createClient({
    socket: {
        host: '127.0.0.1',
        port: 6379
    },
    password: 'w@lkingth3d0g'
})

client.on('error', (err) => console.log('Redis Client Error', err))
client.on('connect', () => { console.log('Connected!') })
client.on('ready', () => { console.log('Ready!') })
client.on('end', () => { console.log('end session!') })


f.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/', // optional: default '/'
})

f.get('/', async (request, reply) => {
    reply.header('Content-Type', 'application/json')
    reply.send({ hello: "newman" })
})

f.get('/about', async (request, reply) => {
    reply.sendFile('about.html')
})

f.get('/vote/:ballot', async (request, reply) => {
    await client.connect();
    const { ballot } = request.params;
    console.log("Tally a vote for " + ballot)

    await client.set('foo', 'bar');
    const fooValue = await client.get('foo');
    console.log(fooValue);
    // client.set('framework', 'ReactJS')
    //   client.get('framework', (e,r)=>{
    //     console.log(r)
    //   })
      
      reply.sendFile('voted.html')

    // client.get('framework', function(err, data) {
    //     console.log(`Error: GET ERROR ${err}`)
    //     console.log(data); // ReactJS
    //     reply.sendFile('voted.html')
    //   })
    
    // var fw = client.get('framework')
    // console.log(fw)
    // reply.sendFile('voted.html')
    // client.set('stuff', ballot);

    // client.set('stuffnew', ballot, (err, rep) => {
    //     if (err) {
    //         console.log(err);
    //         console.log(rep);
    //     } else {
    //         reply.sendFile('voted.html')
    //     }




    //     // client.get('stuffnew', (err, rep) => {
    //     //     if (err) throw err;
    //     //     console.log(rep);
    //     //     // console.log("Redis says " + value)
    //     //     reply.sendFile('voted.html')
    //     // })
    // })

})



// // Run the server!
const start = async () => {
    try {
      await f.listen({ port: 3000 })
    } catch (err) {
      f.log.error(err)
      process.exit(1)
    }
  }
  start()