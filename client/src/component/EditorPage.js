import React, { useEffect, useState} from 'react'
import Client from './Client.js';
import Editor from './Editor.js';
import { useRef } from 'react';
import {useNavigate,useLocation,useParams, Navigate} from 'react-router-dom';
import { initSocket } from '../socket.js';
import {io} from 'socket.io-client';
import {toast} from 'react-hot-toast';


function EditorPage() {
    const [clients,setClient]=useState([]);
    const socketRef=useRef(null);
    const codeRef=useRef(null);
    const location=useLocation();
    const {roomId}=useParams();
    const navigate=useNavigate();

    useEffect(() => {
        const init =async() => {
            socketRef.current=await initSocket();
            socketRef.current.on('connect_error',(err) => handleError(err));
            socketRef.current.on('connect_failed',(err) => handleError(err));
             
            const handleError = (e) =>{
                console.log('socket error=>',e);
                toast.error("socket connection failed");
                navigate("/");
            };

            socketRef.current.on("connect", () => {
                console.log(`✅ Connected to server: ${socketRef.current.id}`);
            });

            socketRef.current.emit("join",{
            roomId,
            username: location.state?.username,
            });
            socketRef.current.on('joined',({clients,username,socketId}) => {
                if (username !== Location.state?.username) { //this will send to everyone that this person has joined to the meeting.
                    toast.success(`${username} joined the room.`);
                }
                setClient(clients);
                socketRef.current.emit('sync-code',{
                    code:codeRef.current,
                    socketId,
                });// this is for the code available for the new person when he joins to see the old code.
            }); 
            // this is listening from the emission(emit i.e join) given from backend OR disconnected
            socketRef.current.on("disconnected",({socketId,username}) => {
                toast.success(`${username} left the room`);
                setClient((prev) => {
                    return prev.filter((clients) => clients.socketId !=socketId);
                });
            });
        };
        init();
        
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off('joined');
            socketRef.current.off('disconnected');
        }
    },[]);

    if(!location.state)
    {
        return <Navigate to="/" />
    }

    const copyRoomID=async() => {
        try{
            await navigator.clipboard.writeText(roomId);
            toast.success("Hurray!! RoomId is copied");
        } catch(error) {
            toast.error("unable to copy Room Id!!")
        }
    }


    const LeaveRoom=async() => {
        navigate("/");
    };

  return (
    <div className="container-fluid vh-100">
        <div className="row h-100">
            <div className="col-md-2 bg-dark text-light d-flex flex-column h-100" style={{boxShadow: "2px 0px 4px rgba(0,0,0,0.1)"}}>
                <img src="/images/codecast.png" alt="CodeCast" className="img-fluid mx-auto" style={{maxWidth:"180px",marginTop:"-43px"}} />
                <hr style={{marginTop:"-3rem"}}/>
                {/*Client list container */}
                <div className="d-flex flex-column overflow-auto">
                    {clients.map((client)=>(
                        <Client key={client.socketId} username={client.username} />
                    ))}
                </div>
                {/*buttons*/}
                <div className="mt-auto">
                <hr />
                    <button onClick={copyRoomID} className="btn btn-success mt-2 mb-2">Copy Room Id</button>
                    <button onClick={LeaveRoom} className="btn btn-danger mt-2 mb-2 px-3  btn-block">Leave Room</button>
                </div>
            </div>
            {/*Editor */}
            <div className="col-md-10 text-light d-flex flex-column h-100">
                <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=> codeRef.current=code} />
            </div>
        </div>
    </div>
  )
}

export default EditorPage