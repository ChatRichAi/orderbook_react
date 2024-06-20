const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post('/api/gemini', async (req, res) => {
    const userInput = req.body.userInput;

    try {
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=AIzaSyCkWWLcyGoI8gF6Lv8EWXwiF8DCPGFsI9Y',
            {
                prompt: {
                    text: userInput
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        res.json(response.data.candidates[0].output);
    } catch (error) {
        console.error('Error sending request to Gemini API:', error);
        res.status(500).json({ error: '请求失败，请稍后再试。' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});