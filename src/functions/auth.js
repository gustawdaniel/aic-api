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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.auth = exports.getUser = exports.tokenizeUser = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const issuer = `aic`;
const jwtKey = (_a = process.env.JWT_SECRET_KEY) !== null && _a !== void 0 ? _a : 'test';
function tokenizeUser(user) {
    return jsonwebtoken_1.default.sign({
        sub: user.id,
        email: user.email,
        iss: issuer,
        roles: user.roles,
        exp: (0, dayjs_1.default)().add(1, 'month').unix()
    }, jwtKey);
}
exports.tokenizeUser = tokenizeUser;
function getUser(token) {
    if (!token) {
        return null;
    }
    else {
        token = token.replace(/^Bearer\s+/, '');
        const jwtPayload = jsonwebtoken_1.default.verify(token, jwtKey);
        return {
            id: jwtPayload.sub,
            email: jwtPayload.email,
            roles: jwtPayload.roles
        };
    }
}
exports.getUser = getUser;
function auth(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = (request.headers.authorization || '').replace(/Bearer\s+/, '') || undefined;
        request.user = getUser(token);
        if (!request.user)
            reply.unauthorized();
    });
}
exports.auth = auth;
function admin(request, reply) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        yield auth(request, reply);
        if (!((_b = (_a = request.user) === null || _a === void 0 ? void 0 : _a.roles) === null || _b === void 0 ? void 0 : _b.includes('admin')))
            reply.unauthorized();
    });
}
exports.admin = admin;
