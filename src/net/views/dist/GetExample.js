"use strict";
/**  @module net.views */
exports.__esModule = true;
exports.GetExample = void 0;
/**   Callback interface based on IWebRequest for endpoint: /getExample */
exports.GetExample = {
    get: function (req, res, next) {
        var index = Number.parseInt("" + req.query.index);
        var response = {
            data: {
                person: isNaN(index) ? "No person index defined" : [{ name: "Jannick Oste" }, { name: "Tom Bom" }][index],
                index: isNaN(index) ? -1 : index
            }
        };
        return response;
    },
    post: undefined
};
