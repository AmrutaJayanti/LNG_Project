const { nanoid } = require('nanoid');

// Colors for players
const COLORS = ['red', 'green', 'yellow', 'blue'];

// Generate a unique 6-character room code
const generateRoomCode = () => nanoid(6).toUpperCase();

// Roll a dice (1-6)
const rollDice = () => Math.floor(Math.random() * 6) + 1;

// Validate player name
const validatePlayerName = (name) => {
  return typeof name === 'string' && name.trim().length > 0 && name.length <= 20;
};

// Validate room ID
const validateRoomId = (roomId) => {
  return typeof roomId === 'string' && roomId.trim().length === 6;
};

// Check if a move is valid based on Ludo rules
const isValidMove = (room, color, tokenIndex, steps) => {
  const position = room.positions[color][tokenIndex];
  // Token can only move out of base (position 0) with a roll of 6
  if (position === 0 && steps !== 6) return false;
  // Ensure token doesn't move beyond the board (simplified: 52 positions)
  if (position + steps > 52) return false;
  return true;
};

// Check if a player has won
const checkWinCondition = (positions, color) => {
  return positions[color].every((pos) => pos === 52);
};

module.exports = {
  COLORS,
  generateRoomCode,
  rollDice,
  validatePlayerName,
  validateRoomId,
  isValidMove,
  checkWinCondition,
};