"use strict";
/**
 * @module net.views
 */
exports.__esModule = true;
exports.PostExample = void 0;
/**  Callback interface based on IWebRequest for endpoint: postExample. */
exports.PostExample = {
    get: function (req, res, next) {
        var response = {
            data: {
                message: undefined
            }
        };
        return response;
    },
    post: function (req, res, next) {
        var response = {
            data: {
                message: "<h2>Welcome, " + req.body.fname + "</h2>"
            }
        };
        return response;
    }
};
