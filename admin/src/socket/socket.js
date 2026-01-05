import { useEffect } from "react";
import { io } from "socket.io-client";

export function useScooterSocket(onUpdate) {
  useEffect(() => {
    const socket = io("http://localhost:3001", {
        transports: ["polling"],
    });

    socket.on("scooter-update", onUpdate);

    return () => {
      socket.disconnect();
    };
  }, [onUpdate]);
}