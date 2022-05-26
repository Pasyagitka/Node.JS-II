const {createClient} = require("redis");

//npx redis-cli -u redis://h:MQEfTL3BiOIojBNpviPXdVqhDdvhNCl2@redis-10935.c256.us-east-1-2.ec2.cloud.redislabs.com:10935
//lrange token 0 -1

(async () => {
  const client = createClient({
    url: 'redis://redis-10935.c256.us-east-1-2.ec2.cloud.redislabs.com:10935',
    password: 'MQEfTL3BiOIojBNpviPXdVqhDdvhNCl2'
  });

  client.on("ready", () => {console.log('ready')})
  client.on("connect", () => {console.log('connect')})
  client.on('error', (err) => console.log('Redis Client Error', err));
  client.on("end", () => {console.log('end')})

  await client.connect();

    //   await client.set('hi', 'world!');
  const value = await client.get('hi');
  console.log(value);

  await client.quit();
})();