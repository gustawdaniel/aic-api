import 'dotenv/config'

import axios from "axios";

const options = {
    method: 'POST',
    url: process.env.OPEN_AI_URL + '/v1/chat/completions',
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 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'
    },
    data: {
        model: 'gpt-3.5-turbo',
        //messages: [{role: 'user', content: 'What is the OpenAI mission?'}],
        messages: [
            {
                role: 'system',
                content: 'Jestem tłumaczem z Polskiego na Angielski'
            },
            {
                role: 'user',
                content: 'Przetłumacz ten tekst z polskiego na angielski\n' +
                    '\n' +
                    'Jeśli chcesz wymienić doświadczenia związane z automatyzacją pracy z tłumaczeniami zapraszam do komentowania. Chętnie dowiem się jakich narzędzi używacie i czy też czasami piszecie własne pomocnicze skrypty czy polecacie jakiś zestaw narzędzi jak'
            }
        ]
    }
};

axios.request(options).then(function (response) {
    console.dir(response.data, {depth: 10});
}).catch(function (error) {
    console.error(error);
});
