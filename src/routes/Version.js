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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Version = void 0;
const package_json_1 = __importDefault(require("../../package.json"));
const prisma_1 = require("../storage/prisma");
class Version {
    static root(_, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = yield prisma_1.prisma.error_logs.count({
                where: {
                    resolved: false
                }
            });
            if (errors) {
                return reply.internalServerError(`Found ${errors} unresolved errors`);
            }
            return {
                name: package_json_1.default.name,
                version: package_json_1.default.version,
            };
        });
    }
}
exports.Version = Version;
