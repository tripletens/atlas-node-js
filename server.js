// let express = require('express')
// const cors = require('cors');
// let http = require('http');


// let app = express();

// app.use(cors());
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin,X-Requested-With,Content-Type,x-auth,Accept,content-type,application/json'
//   );
//   next();
// });


//  let server = http.Server(app);

// let socketIO = require('socket.io');
// let io = socketIO(server);


const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origins: '*'
    }
});

var users = [];

    io.on('connection', (socket) => {
       console.log('user connected');

        // socket.on("disconnecting", (reason) => {
        //     socket.to(room).emit("user has left", socket.id);
        // });

        socket.on('connected', (userId)=>{
            users[userId] = socket.id;
            console.log(`connection opened for user ${userId}`)
            console.log(users)
        });

        socket.on("send-msg", (data) => {
            //console.log(`message sent to user ${users[data.user] }`)
            data.sender = data.sender
            io.to(users[data.user]).emit("msgRec", data);
            io.to(users[data.user]).emit('notification', data)

          });


          socket.on("typing-msg", (data) => {
           //// console.log(`typing to dis user ${users[data.user] }`)
            data.sender = data.sender
            io.to(users[data.user]).emit("typing", data);

          });


          socket.on("send-order-notification", (data) => {
            console.log(`send msg notification ${users[data.user]}`)
            data.sender = data.sender
            io.to(users[data.user]).emit("vendor-recevied", data);

          });


          


    
        socket.on('new-message', (message) => {
             console.log(message);
            io.emit('data', message);
          });


    });


  


const port = process.env.PORT || 3000;



http.listen(port, () => {
    console.log(`started on port: ${port}`);
});