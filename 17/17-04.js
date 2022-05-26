const {createClient} = require("redis");
const I = 10000;

(async () => {
  const client = createClient({
    url: 'redis://redis-10935.c256.us-east-1-2.ec2.cloud.redislabs.com:10935',
    password: 'MQEfTL3BiOIojBNpviPXdVqhDdvhNCl2'
  });

  client.on("ready", () => {console.log('ready')})
  client.on("connect", () => {console.log('connect')})
  client.on('error', (err) => console.log('error', err));
  client.on('reconnecting', () => console.log('reconnecting'));
  client.on("end", () => {console.log('end')})

  await client.connect();

  await client.hSet('key', 0, Buffer.from(`id:0,val:'val-0'`));

  //Sets field in the hash stored at key to value. 
  //If key does not exist, a new key holding a hash is created. If field already exists in the hash, it is overwritten
  let start = Date.now();
  for (let i = 0; i< I; i++) {
    await client.hSet('key', i, Buffer.from(`id:${i},val:'val-${i}'`));
  }
  console.log(`hSet: ${Date.now() - start}ms`);

  start = Date.now();
  for (let i = 0; i< I; i++) {
    await client.hGet('key', i.toString());
  }
  console.log(`hGet: ${Date.now() - start}ms`);

  await client.quit();
})();