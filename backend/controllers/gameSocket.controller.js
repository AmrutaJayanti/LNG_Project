const allUsers = {};
const allRooms = [];

const handleSocketConnection = (io) => {
  io.on("connection", (socket) => {
    allUsers[socket.id] = {
      socket: socket,
      online: true,
    };

    console.log(`User connected: ${socket.id}`);

    socket.on("request_to_play", (data) => {
      const currentUser = allUsers[socket.id];
      currentUser.playerName = data.playerName;

      let opponentPlayer;

      for (const key in allUsers) {
        const user = allUsers[key];
        if (user.online && !user.playing && socket.id !== key) {
          opponentPlayer = user;
          break;
        }
      }

      if (opponentPlayer) {
        currentUser.playing = true;
        opponentPlayer.playing = true;

        allRooms.push({
          player1: opponentPlayer,
          player2: currentUser,
        });

        currentUser.socket.emit("OpponentFound", {
          opponentName: opponentPlayer.playerName,
          playingAs: "circle",
        });

        opponentPlayer.socket.emit("OpponentFound", {
          opponentName: currentUser.playerName,
          playingAs: "cross",
        });

        currentUser.socket.on("playerMoveFromClient", (data) => {
          opponentPlayer.socket.emit("playerMoveFromServer", { ...data });
        });

        opponentPlayer.socket.on("playerMoveFromClient", (data) => {
          currentUser.socket.emit("playerMoveFromServer", { ...data });
        });
      } else {
        currentUser.socket.emit("OpponentNotFound");
      }
    });

    socket.on("disconnect", () => {
      const currentUser = allUsers[socket.id];
      if (!currentUser) return;

      currentUser.online = false;
      currentUser.playing = false;

      console.log(`User disconnected: ${socket.id}`);

      for (let i = 0; i < allRooms.length; i++) {
        const { player1, player2 } = allRooms[i];

        if (player1.socket.id === socket.id) {
          player2.socket.emit("opponentLeftMatch");
          break;
        }

        if (player2.socket.id === socket.id) {
          player1.socket.emit("opponentLeftMatch");
          break;
        }
      }
    });
  });
};

const setup = handleSocketConnection;

export default setup
