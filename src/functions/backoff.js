"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.backoff = void 0;
function backoff(client, params) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        //createCompletion
        const maxRetry = 13; // 2^3 = 8192 sec -> 2.5 h
        const initialDelay = 1000;
        const retryOn = [429];
        const exponentialBackoff = (n) => Math.pow(2, n) * initialDelay;
        let retryCount = 0;
        let delay = initialDelay;
        while (retryCount < maxRetry) {
            try {
                return yield client.createCompletion(params);
            }
            catch (error) {
                if (!retryOn.includes((_a = error.response) === null || _a === void 0 ? void 0 : _a.status)) {
                    throw error;
                }
                retryCount++;
                delay = exponentialBackoff(retryCount);
                console.log(`Retrying request in ${delay}ms...`.red);
                yield new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        throw new Error(`Max retry attempts reached (${maxRetry})`);
    });
}
exports.backoff = backoff;
