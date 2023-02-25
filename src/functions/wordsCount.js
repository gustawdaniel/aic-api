"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordsCount = void 0;
function wordsCount(str) {
    return str.split(' ')
        .filter(function (n) { return n != ''; })
        .length;
}
exports.wordsCount = wordsCount;
