import express from 'express';
import Chat from '../models/Chat.js';
const router = express.Router();
import User from '../models/User.js';
import Message from '../models/Message.js';

router.post('/conversation', async (req, res) => {
  try {
        const { senderId, receiverId } = req.body;
        const newCoversation = new Chat({ members: [senderId, receiverId] });
        await newCoversation.save();
        res.status(200).send('Conversation created successfully');
    } catch (error) {
        console.log(error, 'Error')
    }
});

router.post('/conversation/:userId', async (req, res) => {
 try {
        const userId = req.params.userId;
        const conversations = await Chat.find({ members: { $in: [userId] } });
        const conversationUserData = Promise.all(conversations.map(async (conversation) => {
            const receiverId = conversation.members.find((member) => member !== userId);
            const user = await User.findById(receiverId);
            return { user: { receiverId: user._id, email: user.email, fullName: user.fullName }, conversationId: conversation._id }
        }))
        res.status(200).json(await conversationUserData);
    } catch (error) {
        console.log(error, 'Error')
    }
});

router.get('/message', async (req, res) => {
   try {
        const { conversationId, senderId, message, receiverId = '' } = req.body;
        if (!senderId || !message) return res.status(400).send('Please fill all required fields')
        if (conversationId === 'new' && receiverId) {
            const newCoversation = new Chat({ members: [senderId, receiverId] });
            await newCoversation.save();
            const newMessage = new Message({ conversationId: newCoversation._id, senderId, message });
            await newMessage.save();
            return res.status(200).send('Message sent successfully');
        } else if (!conversationId && !receiverId) {
            return res.status(400).send('Please fill all required fields')
        }
        const newMessage = new Message({ conversationId, senderId, message });
        await newMessage.save();
        res.status(200).send('Message sent successfully');
    } catch (error) {
        console.log(error, 'Error')
    }
});

router.get('/message/:conversationId',async (req,res) => {
 try {
        const checkMessages = async (conversationId) => {
            console.log(conversationId, 'conversationId')
            const messages = await Message.find({ conversationId });
            const messageUserData = Promise.all(messages.map(async (message) => {
                const user = await User.findById(message.senderId);
                return { user: { id: user._id, email: user.email, fullName: user.fullName }, message: message.message }
            }));
            res.status(200).json(await messageUserData);
        }
        const conversationId = req.params.conversationId;
        if (conversationId === 'new') {
            const checkConversation = await Chat.find({ members: { $all: [req.query.senderId, req.query.receiverId] } });
            if (checkConversation.length > 0) {
                checkMessages(checkConversation[0]._id);
            } else {
                return res.status(200).json([])
            }
        } else {
            checkMessages(conversationId);
        }
    } catch (error) {
        console.log('Error', error)
    }
})

export default router;