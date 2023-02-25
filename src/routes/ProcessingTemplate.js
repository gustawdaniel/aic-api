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
exports.ProcessingTemplate = void 0;
const prisma_1 = require("../storage/prisma");
function getPrompt(value, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.prisma.prompts.upsert({
            where: {
                value_user_id: {
                    value,
                    user_id
                }
            },
            create: {
                value,
                user_id,
            },
            update: {}
        });
    });
}
class ProcessingTemplate {
    static create(req, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return reply.unauthorized();
            const existing = yield prisma_1.prisma.processing_templates.findFirst({
                where: {
                    user_id: req.user.id,
                    code: {
                        value: req.body.code
                    },
                    header: {
                        value: req.body.header
                    },
                    text: {
                        value: req.body.text
                    }
                }
            });
            if (existing)
                return existing;
            const code = yield getPrompt(req.body.code, req.user.id);
            const header = yield getPrompt(req.body.header, req.user.id);
            const text = yield getPrompt(req.body.text, req.user.id);
            return prisma_1.prisma.processing_templates.create({
                data: {
                    user_id: req.user.id,
                    code_id: code.id,
                    header_id: header.id,
                    text_id: text.id
                }
            });
        });
    }
}
exports.ProcessingTemplate = ProcessingTemplate;
