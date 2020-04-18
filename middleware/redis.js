const redis = require('redis');
const client = redis.createClient({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    username:process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
});

client.on("error", function(error) {
    console.error(error);
});



// client.keys('*', function (err, keys) {
//     if (err) return console.log(err);
//
//     for(let i = 0, len = keys.length; i < len; i++) {
//
//         client.get(keys[i], (err, result) =>{
//             if (err){
//                 console.log(err)
//             }else {
//                 client.ttl(keys[i], (e, t) => {
//                     if (e) {
//                         console.log(e)
//                     }else {
//                         console.log(keys[i],result,t);
//                         if (t !==-1 || t !== false){
//
//                         }
//                     }
//                 });
//
//             }
//         });
//
//     }
// });


// client.set("key", "value" ,"EX",3,(err,val)=>{
//     console.log("val",val)
// })
//
// setInterval(()=> {
//
//     client.get("key", redis.print);
// },1000)



module.exports = client;