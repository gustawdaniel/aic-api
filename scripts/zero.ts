import {pull, push} from "../src/storage/zero";

pull().catch(console.error)

async function main() {
    for(let i = 1; i <= 10; i++) {
        console.log("push", i);
        await push({api_key: '',article_id: ''})
    }
}

main().catch(console.error)
