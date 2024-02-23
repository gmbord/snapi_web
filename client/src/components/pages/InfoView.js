import React, { useEffect, useState } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities.js";

import "./InfoView.css";

/**
 *
 */
const InfoView = ({ userId }) => {
  return (
    <div className="InfoView-container">
      <img className="InfoView-robit" src="/product_sheet.png"></img>
    </div>
  );
};
// script.js

document.addEventListener('DOMContentLoaded', function () {
  const liveQueueData = [
    'User 1',
    'User 2',
    'User 3',
    // ... add more users as needed
  ];

  function updateLiveQueue() {
    const liveQueueElement = document.getElementById('liveQueue');
    liveQueueElement.innerHTML = '';

    liveQueueData.forEach(user => {
      const userElement = document.createElement('div');
      userElement.textContent = user;
      liveQueueElement.appendChild(userElement);
    });
  }

  updateLiveQueue();

  function addToQueue(newUser) {
    liveQueueData.push(newUser);
    updateLiveQueue();
  }

  // Create a button dynamically
  const button = document.createElement('button');
  button.textContent = 'Join Queue';
  button.id = 'addToQueueButton';

  // Apply styles using JavaScript (you can modify these styles)
  button.style.padding = '10px';
  button.style.backgroundColor = '#3498db';
  button.style.color = '#fff';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';

  // Append the button to the body
  document.body.appendChild(button);

  // Add an event listener to the dynamically created button
  button.addEventListener('click', function () {
    const newUserName = prompt('Enter your name:');
    if (newUserName) {
      addToQueue(newUserName);
    }
  });
});

export default InfoView;
