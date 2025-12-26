import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Chat from "../models/Chat.js";
import { getAIResponse } from "../aiService.js";

const router = express.Router();

// Protect all chat routes
router.use(authMiddleware);

router.post("/new", async (req, res) => {
    try {
        const chat = await Chat.create({
            userId: req.user.id,
            messages: []
        });

        res.status(201).json({
            chatId: chat._id,
            title: chat.title
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to create chat" });
    }
});

router.post("/send", async (req, res) => {
    try {
        const { chatId, message } = req.body;

        let chat;

        if (chatId) {
            chat = await Chat.findOne({
                _id: chatId,
                userId: req.user.id
            });
        }

        if (!chat) {
            chat = await Chat.create({
                userId: req.user.id,
                messages: []
            });
        }

        // Save user message
        chat.messages.push({
            role: "user",
            content: message
        });

        // 🤖 GEMINI RESPONSE
        const aiReply = await getAIResponse(chat.messages);
        // const aiReply = "i am fine";

        chat.messages.push({
            role: "assistant",
            content: aiReply
        });

        // Auto-title
        if (chat.title === "New Chat") {
            chat.title = message.substring(0, 30);
        }

        await chat.save();

        res.json({
            chatId: chat._id,
            reply: aiReply
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to send message" });
    }
});

router.get("/all", async (req, res) => {
    try {
        const chats = await Chat.find({ userId: req.user.id })
            .select("_id title createdAt")
            .sort({ updatedAt: -1 });

        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch chats" });
    }
});

router.get("/:chatId", async (req, res) => {
    try {
        const chat = await Chat.findOne({
            _id: req.params.chatId,
            userId: req.user.id
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch chat" });
    }
});

router.delete("/:chatId", async (req, res) => {
    try {
        const chat = await Chat.findOneAndDelete({
            _id: req.params.chatId,
            userId: req.user.id
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        res.json({ message: "Chat deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete chat" });
    }
});

export default router;
