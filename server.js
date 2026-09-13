const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

const API_KEYS = [
    "API_KEY1",
    "API_KEY2",
    "API_KEY3",
    "API_KEY4",
    "API_KEY5",
    "API_KEY6",
    "API_KEY7",
    "API_KEY8",
    "API_KEY9",
    "API_KEY10"
];

let currentKeyIndex = 0;

function getNextKeyIndex() {
    const index = currentKeyIndex;
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    return index;
}

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message || '';
    const files = req.body.files || []; 
    const model = req.body.model || 'gemini-3-7-flash';
    const customKey = req.query.keyapi;

    if (!userMessage && files.length === 0) {
        return res.status(400).json({ error: "Please enter your message or send an attached file." });
    }
    
    const contentsParts = [];
    
    if (Array.isArray(files) && files.length > 0) {
        files.forEach(file => {
            if (file.mimeType && file.data) {
                contentsParts.push({
                    inline_data: {
                        mime_type: file.mimeType, 
                        data: file.data
                    }
                });
            }
        });
    }
    
    if (userMessage) {
        contentsParts.push({ text: userMessage });
    }

    const isUsingCustomKey = Boolean(customKey && customKey.trim() !== '');
    const maxAttempts = isUsingCustomKey ? 1 : API_KEYS.length;
    let attempts = 0;

    while (attempts < maxAttempts) {
        let apiKey;
        let keyIndexUsed;

        if (isUsingCustomKey) {
            apiKey = customKey.trim();
            keyIndexUsed = "Individual";
        } else {
            keyIndexUsed = getNextKeyIndex();
            apiKey = API_KEYS[keyIndexUsed];
        }

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        try {
            const response = await axios.post(
                geminiUrl,
                {
                    contents: [
                        {
                            parts: contentsParts
                        }
                    ]
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 60000 
                }
            );

            if (
                response.data &&
                response.data.candidates &&
                response.data.candidates[0] &&
                response.data.candidates[0].content &&
                response.data.candidates[0].content.parts &&
                response.data.candidates[0].content.parts[0]
            ) {
                const replyText = response.data.candidates[0].content.parts[0].text;
                console.log(`[Thành công] Đã xử lý request bằng Key index #${keyIndexUsed}`);
                return res.json({ reply: replyText });
            } else {
                throw new Error("The feedback structure from Gemini is not suitable.");
            }

        } catch (error) {
            attempts++;
            const status = error.response ? error.response.status : 'NO_RESPONSE';
            const errorMsg = error.response && error.response.data && error.response.data.error 
                ? error.response.data.error.message 
                : error.message;

            console.warn(`[Warning] Error sending Key index #${keyIndexUsed} (Number of attempts ${attempts}/${maxAttempts}) - Status: ${status} - Error: ${errorMsg}`);
            
            if (isUsingCustomKey) {
                return res.status(400).json({ error: `Personal key is corrupted: ${errorMsg}` });
            }

            // Nếu đã xoay hết 10 Key hệ thống mà vẫn lỗi thì báo lỗi về Frontend
            if (attempts >= maxAttempts) {
                return res.status(429).json({ 
                    error: "The API system is experiencing issues, please try again." 
                });
            }
        }
    }
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`=== Gemini Proxy Server currently operating at the port ${PORT} ===`);
});
