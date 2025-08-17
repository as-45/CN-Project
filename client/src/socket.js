import { io } from "socket.io-client";
const BACKEND_URL = "http://localhost:5000"; 

export const initSocket= async() => {
    const options={
        'force new connection':true,
        reconnectionAttempt:"infinity",
        timeout:10000,
        transports:["websocket"],
    };
    return io(BACKEND_URL,options);
};