"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GETRequest = void 0;
const ViewTemplates_1 = require("../../ViewTemplates");
let GETRequest = class GETRequest {
    constructor() {
        this.post = undefined;
    }
    get(req, res, next) { return { data: {} }; }
    ;
};
GETRequest = __decorate([
    ViewTemplates_1.ViewTemplates.set
], GETRequest);
exports.GETRequest = GETRequest;
