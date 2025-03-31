const express=require("express");
const app=express();
const http=require("http");
const {Server}=require("socket.io");
const userSocketMap={};
const getAllConnectClients=(roomId) => {// this is getting the roomid from the N number of rooms available in the lib.
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,username:userSocketMap[socketId],
            }
        }
    );
}

const server=http.createServer(app);
const io = new Server(server, {
    cors: {
        origin:"*",
        methods:["GET","POST"],
    },
});

io.on("connection",(socket) => {
    // console.log(`User connected: ${socket.id}`); 
    
    socket.on('join',({roomId,username}) => {
        //here i am including the logic for identifying the socket number of
        //  the user,like every user will have an unique socketid
        userSocketMap[socket.id]=username;
        //the next line is joining the  username with the same roomId, it is checking if it has the same roomId for everyone
        socket.join(roomId); 
        //next line is for the information giving to all the members in the meeting that a new user has joined
        const clients=getAllConnectClients(roomId);
        clients.forEach(({socketId}) => { // for notifying to each user that a new user has joined
            io.to(socketId).emit("joined",{
                clients,username,socketId:socket.id,
            })

        })
    });
    socket.on('code-change',({roomId,code})=> {
        socket.in(roomId).emit("code-change",{code});
    });

    //this will sync the previous code and show it to the new joiner
    socket.on("sync-code",({socketId,code})=> {
        io.to(socketId).emit("code-change",{code});
    });

    socket.on("disconnecting",() => {
        const rooms=[...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit('disconnected', {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id] // we are deleteing it from here
        socket.leave();
    });
});


const PORT=process.env.PORT || 5000;
server.listen(PORT, () => console.log("server is running"));