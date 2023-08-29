import { useEffect } from "react";
import { io } from "socket.io-client";

const Dashboard = () => {
  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on('connect', () => {
      //console.log("Socket connected");
    });

    socket.on('disconnect', () => {
      //console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect(); // Disconnect the socket when the component unmounts
    };
  }, []);

  return (
    <p>Whats up my homies</p>
  );
};

export default Dashboard;





