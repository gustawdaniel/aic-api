import {createPatch, applyPatch} from 'rfc6902'

const a = undefined;
const b = {first: 'Chris', last: 'Brown'};

console.log(createPatch(a, b));
console.log(createPatch(b, a));
