import React, { useEffect, useState } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";

import "./QueueView.css";

const QueueView = (props) => {
  const [queue, setQueue] = useState([]);

  const handleEnqueue = () => {
    // Assuming userId is available in props
    const userId = props.userId; //??????

    // Add the user ID to the queue
    const newQueue = [...queue, userId];
    setQueue(newQueue);
  };

  const handleDequeue = () => {
    const newQueue = [...queue];
    newQueue.shift(); // Remove the first item from the queue
    setQueue(newQueue);
  };

  return (
    <div>
      <h1>This is the Queue Page</h1>
      <button onClick={handleEnqueue}>Enqueue</button>
      <button onClick={handleDequeue}>Dequeue</button>
      <div>
        <h2>Queue:</h2>
        <ul>
          {queue.map((userId, index) => (
            <li key={index}>{userId}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QueueView;
