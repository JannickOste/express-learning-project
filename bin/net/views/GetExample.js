"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetExample = void 0;
const GETRequest_1 = require("./models/GETRequest");
/**
 * Callback interface based on IWebRequest for endpoint: getExample
 */
class GetExample extends GETRequest_1.GETRequest {
    get(req, res, next) {
        const index = Number.parseInt(`${req.query.index}`);
        const response = {
            data: {
                person: isNaN(index) ? "No person index defined" : [{ name: "Jannick Oste" }, { name: "Tom Bom" }][index],
                index: isNaN(index) ? -1 : index
            }
        };
        return response;
    }
}
exports.GetExample = GetExample;
