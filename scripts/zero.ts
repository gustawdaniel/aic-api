import {pull, push} from "../src/storage/zero";

pull().catch(console.error)

async function main() {
    for(let i = 1; i <= 10; i++) {
        console.log("push", i);
        await push(`ok ${i}`)
    }
}

main().catch(console.error)
