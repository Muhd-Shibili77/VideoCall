import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";

const socket = io("http://localhost:5000");

const VideoChat = () => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [peer, setPeer] = useState(null);
  const myVideo = useRef();
  const remoteVideo = useRef();

  useEffect(() => {
    const newPeer = new Peer();

    newPeer.on("open", (id) => {
      setPeerId(id);
    });

    newPeer.on("call", (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        myVideo.current.srcObject = stream;
        call.answer(stream);
        call.on("stream", (remoteStream) => {
          remoteVideo.current.srcObject = remoteStream;
        });
      });
    });

    setPeer(newPeer);
  }, []);

  const startCall = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      myVideo.current.srcObject = stream;
      const call = peer.call(remotePeerId, stream);
      call.on("stream", (remoteStream) => {
        remoteVideo.current.srcObject = remoteStream;
      });
    });
  };

  return (
    <div>
      <h2>Your Peer ID: {peerId}</h2>
      <input
        type="text"
        placeholder="Enter remote Peer ID"
        value={remotePeerId}
        onChange={(e) => setRemotePeerId(e.target.value)}
      />
      <button onClick={startCall}>Start Call</button>
      
      <div>
        <video ref={myVideo} autoPlay playsInline muted style={{ width: "300px" }} />
        <video ref={remoteVideo} autoPlay playsInline style={{ width: "300px" }} />
      </div>
    </div>
  );
};

export default VideoChat;
