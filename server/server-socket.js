let io;

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object

const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => {
  const connectedSockets = io.sockets.connected;

  // Check if the socket ID exists in the connected sockets
  if (connectedSockets && socketid in connectedSockets) {
    return connectedSockets[socketid];
  }

  // Return null or handle the case when the socket ID is not found
  return null;
};

const addUser = (user, socket) => {
  const oldSocket = userToSocketMap[user._id];

  // Check if oldSocket exists and has the 'id' property before accessing it
  if (oldSocket && oldSocket.id) {
    // There was an old tab open for this user, force it to disconnect
    oldSocket.disconnect();
    delete socketToUserMap[oldSocket.id];
  }

  // Check if socket exists and has the 'id' property before accessing it
  if (socket && socket.id) {
    userToSocketMap[user._id] = socket;
    socketToUserMap[socket.id] = user;
  }
};

const removeUser = (user, socket) => {
  if (user) delete userToSocketMap[user._id];
  delete socketToUserMap[socket.id];
};

module.exports = {
  init: (http) => {
    io = require("socket.io")(http);

    io.on("connection", (socket) => {
      console.log(`socket has connected ${socket.id}`);
      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);
        removeUser(user, socket);
      });
    });
  },

  addUser: addUser,
  removeUser: removeUser,

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  getIo: () => io,
};
