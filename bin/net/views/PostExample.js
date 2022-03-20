"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostExample = void 0;
const ViewTemplates_1 = require("../ViewTemplates");
/**
 * Callback interface based on IWebRequest for endpoint: postExample.
 */
let PostExample = class PostExample {
    get(req, res, next) {
        const response = {
            data: {
                message: undefined
            }
        };
        return response;
    }
    post(req, res, next) {
        const response = {
            data: {
                message: `<h2>Welcome, ${req.body.fname}</h2>`
            }
        };
        return response;
    }
};
PostExample = __decorate([
    ViewTemplates_1.ViewTemplates.set
], PostExample);
exports.PostExample = PostExample;
