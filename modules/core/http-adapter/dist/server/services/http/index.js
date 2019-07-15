"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __importDefault(require("request"));
var lodash_1 = __importDefault(require("lodash"));
var deep_extend_1 = __importDefault(require("deep-extend"));
var Util = __importStar(require("../../../../utils/http-utils"));
var CONNECTION_TIMEOUT = 20 * 1000;
var HttpService = /** @class */ (function () {
    function HttpService() {
        this.baseOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
            json: true,
            forever: true,
            timeout: CONNECTION_TIMEOUT,
        };
        this.onHeaderReady = undefined;
        this.onOptionReady = undefined;
        this.onRes = undefined;
        this.appSign = {
            key: '',
            secret: ''
        };
    }
    HttpService.prototype.setAppSign = function (appSign) {
        this.appSign = appSign;
    };
    HttpService.prototype.setHeaderReadyHook = function (fn) {
        this.onHeaderReady = fn;
    };
    HttpService.prototype.setOptionReadyHook = function (fn) {
        this.onOptionReady = fn;
    };
    HttpService.prototype.setResReadyHook = function (fn) {
        this.onRes = fn;
    };
    /**
     * 生成签名，输出请求 option
     * @param options
     */
    HttpService.prototype.makeSign = function (options) {
        var result = lodash_1.default.cloneDeep(options);
        var appSign = this.appSign;
        var reqData = {};
        var ts = new Date().getTime();
        var requestUri = options.uri;
        //删除协议
        requestUri = requestUri.replace(/^http(s)?:\/\/(.*?)\//, '/');
        requestUri = requestUri.split('?')[0];
        var appKey = appSign.key;
        var appSecret = appSign.secret;
        reqData = options.data || {};
        var dataKeys = lodash_1.default.keys(reqData);
        dataKeys = dataKeys.sort();
        var reqDataSorted = {};
        lodash_1.default.each(dataKeys, function (key) {
            reqDataSorted[key] = reqData[key];
        });
        // 过滤 超出长度的参数，不进行签名处理
        lodash_1.default.each(dataKeys, function (key) {
            var reqDataVal = reqDataSorted[key];
            if (reqDataVal && reqDataVal.toString) {
                if (encodeURIComponent(reqDataVal.toString()).length > 100) {
                    reqDataSorted[key] = '';
                }
            }
        });
        var paramStr = Util.paramForSignature(reqDataSorted);
        var signStr = [
            options.method,
            ts,
            requestUri,
            paramStr
        ].join(':');
        if (options.headers && appKey && appSecret) {
            result.headers.appKey = appKey;
            result.headers.ts = ts;
            result.headers.requestUri = requestUri;
            result.headers.method = options.method;
            result.headers.signature = Util.crypt(signStr, appSecret);
        }
        return result;
    };
    HttpService.prototype.buildOption = function (actionName, apiDesc, params) {
        var result = deep_extend_1.default(lodash_1.default.cloneDeep(this.baseOptions), apiDesc.options);
        // uri
        result.uri = apiDesc.url;
        // restful url
        if (params) {
            result.uri = Util.parseRestUrl(result.uri, params);
        }
        // method
        result.method = apiDesc.method;
        // headers
        if (apiDesc.auth === true) {
            if (params && params.token) {
                result.headers.accessToken = params.token;
            }
        }
        // // header hook 回调
        if (this.onHeaderReady) {
            result.headers = this.onHeaderReady(result.headers);
        }
        // 参数处理
        if (lodash_1.default.isEmpty(params) === false) {
            var data = params;
            result.data = data;
            if (apiDesc.method === 'GET' || apiDesc.method === 'DELETE') {
                result.qs = data;
            }
            if (apiDesc.method === 'POST' || apiDesc.method === 'PUT') {
                if (apiDesc.jsonBody === true) {
                    result.headers['Content-Type'] = 'application/json';
                    result.form = undefined;
                    result.body = data;
                }
                if (apiDesc.jsonBody !== true) {
                    result.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    result.body = undefined;
                    result.form = data;
                }
            }
        }
        // option hook 回调
        if (this.onOptionReady) {
            result = this.onOptionReady(result);
        }
        // 签名处理
        result = this.makeSign(result);
        return result;
    };
    HttpService.prototype.request = function (actionName, apiDesc, params) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                var options = _this.buildOption(actionName, apiDesc, params);
                                request_1.default(options, function (oriError, oriResponse, oriBody) {
                                    var error;
                                    var response;
                                    var body;
                                    if (_this.onRes) {
                                        var newRes = _this.onRes(oriError, oriResponse, oriBody);
                                        error = newRes.error;
                                        response = newRes.response;
                                        body = newRes.body;
                                    }
                                    else {
                                        error = oriError;
                                        response = oriResponse;
                                        body = oriBody;
                                    }
                                    var errMsg;
                                    if (error || !response || response.statusCode !== 200) {
                                        errMsg = error || body;
                                        reject(errMsg);
                                    }
                                    resolve(body);
                                });
                            })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                    case 2:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return HttpService;
}());
exports.default = HttpService;
//# sourceMappingURL=index.js.map