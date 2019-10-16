exports.Server = require("./core/Server").Server;
exports.Sfs = require("./core/Sfs").Sfs;
exports.appExtentions = require("./core/app-extentions").appExtentions;

exports.CheckBox = require("./components/CheckBox").default;
exports.SfsImage = require("./components/SfsImage").default;
exports.InputNumber = require("./components/InputNumber").default;

exports.appUtils = {
    waitImagesLoad: require('./utils/waitImagesLoad').default
};

window.SNApp = exports;
