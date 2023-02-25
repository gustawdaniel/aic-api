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
exports.Migration1676697232404 = void 0;
class Migration1676697232404 {
    up(db) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db.collection('users').updateMany({
                email: 'gustaw.daniel@gmail.com'
            }, {
                $set: {
                    roles: ['admin']
                }
            });
            yield db.collection('users').updateMany({
                email: { $ne: 'gustaw.daniel@gmail.com' }
            }, {
                $set: {
                    roles: []
                }
            });
        });
    }
    down(db) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db.collection('users').updateMany({}, {
                $unset: {
                    roles: 1
                }
            });
        });
    }
}
exports.Migration1676697232404 = Migration1676697232404;
