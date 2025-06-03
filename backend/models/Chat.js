const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
    members: {
        type: Array,
        required: true,
    }
});

const Chat = mongoose.model('Chat', conversationSchema);

module.exports = Chat;