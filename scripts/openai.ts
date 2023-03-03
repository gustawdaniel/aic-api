import 'dotenv/config'

import axios from "axios";

const options = {
    method: 'POST',
    url: 'https://api.openai.com/v1/chat/completions',
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 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'
    },
    data: {
        model: 'gpt-3.5-turbo',
        messages: [{role: 'user', content: 'What is the OpenAI mission?'}]
    }
};

axios.request(options).then(function (response) {
    console.log(response.data);
}).catch(function (error) {
    console.error(error);
});
