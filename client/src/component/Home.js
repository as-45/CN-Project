import React, { useState,useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {RingLoader} from 'react-spinners';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";



function Home() {
    const [roomId,setRoomId]=useState("");
    const [username,setUsername]=useState("");
    const [loading, setLoading] = useState(false); //added for react-spinner
    const navigate= useNavigate();    

    const particlesInit = async (engine) => {
        await loadSlim(engine);
      };






    const generateRoomId= (e) => {
        e.preventDefault();
        const id=uuidv4();
        setRoomId(id);
        toast.success("New RoomID is generated");
    };
    const joinRoom = () => {
        if(!roomId || !username)
        {
            toast.error("Both the Fields are required");
            return ;
        }
        // //navigate
        // navigate(`/editor/${roomId}`,{
        //     state: {username},
        // });
        // toast("You Entered into the Room");

        setLoading(true); // Show spinner while navigating

    setTimeout(() => {
      navigate(`/editor/${roomId}`, { state: { username } });
      setLoading(false); // Hide spinner after navigation
    }, 1000);



    };
  return (
    <div className="container-fluid">
        <Particles
    init={particlesInit}
    options={{
        background: { color: "transparent" },
        particles: {
            number: { value: 100 },
            size: { value: 3 },
            move: { speed: 2 },
            shape: { type: "circle" },
            color: { value: "#ffffff" },
        },
    }}
    style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
    }}
/>



        <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-12 col-md-6">
                <div className="card shadow-sm p-2 mb-5 bg-secondry rounded">
                    <div className="card-body text-center bg-dark">
                        <img className="img-fluid mx-auto d-block" src="/images/pic.png" alt="CodeCast" style={{ maxWidth:"150px"}}/>
                        <h1 className="fs-2 text-light">Enter the Room ID </h1>

                        <div className="form-group">
                            <input value={roomId} onChange={(e) => setRoomId(e.target.value)} type="text" className="form-control mb-2" placeholder="Room ID please!!"/>
                        </div>

                        <div className="form-group">
                            <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" className="form-control mb-2" placeholder="Username please!!"/>
                        </div>

                         {/* Show new RingLoader spinner while loading */}
              {loading ? (
                <div className="spinner-container">
                  <RingLoader color="#ffcc00" size={50} />
                  <p className="text-light mt-2">Joining...</p>
                </div>
              ) :( 



                        <button onClick={joinRoom} className="btn btn-success btn-lg btn-block">JOIN IN</button> )}
                        <p className="mt-3"style={{ color: "gold" }}>Don't Have an Room ID?{" "} <span 
                        className="text-success p-2" style={{cursor: "pointer"}} onClick={generateRoomId}>New Room</span></p>
                    </div>   
                </div>
            </div>    
        </div>
    </div>
  )
}

export default Home