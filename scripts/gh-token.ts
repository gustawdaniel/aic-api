import 'colors-cli/toxic'
import {Ghost} from "../src/platforms/Ghost";

function main() {
    const arg = process.argv[2];

    if(!arg) throw new Error(`add first argument with admin api key`);

    console.log(Ghost.adminApiKeyToToken(arg))
}

main()
