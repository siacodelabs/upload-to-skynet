"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const expected_1 = __importDefault(require("@akromio/expected"));
const doubles_1 = require("@akromio/doubles");
suite(__filename, () => {
    const portal = "https://web3portal.com";
    suite("run()", () => {
        const skynetModulePath = require.resolve("@skynetlabs/skynet-nodejs");
        const actionsCoreModulePath = require.resolve("@actions/core");
        const actionModulePath = require.resolve("./run");
        setup(() => {
            delete require.cache[skynetModulePath];
            delete require.cache[actionsCoreModulePath];
            delete require.cache[actionModulePath];
        });
        teardown(() => {
            doubles_1.interceptor.clear(skynetModulePath);
            doubles_1.interceptor.clear(actionsCoreModulePath);
        });
        test("when file exists, uploadFile() must be called and its skylink returned", () => __awaiter(void 0, void 0, void 0, function* () {
            const { SkynetClient } = yield Promise.resolve().then(() => __importStar(require("@skynetlabs/skynet-nodejs")));
            yield Promise.resolve().then(() => __importStar(require("@actions/core")));
            // (1) arrange
            const testFilePath = node_path_1.default.join(__dirname, "../../tests/data/hello-world.txt");
            const skylink = "sia://the-skylink";
            const uploadFile = (0, doubles_1.monitor)(doubles_1.method.returns(skylink));
            doubles_1.interceptor.module(skynetModulePath, {
                SkynetClient: doubles_1.constructor.returns((0, doubles_1.simulator)(SkynetClient, { uploadFile }))
            });
            const getInput = (0, doubles_1.monitor)((0, doubles_1.method)([
                { args: ["portal"], returns: portal },
                { args: ["path"], returns: testFilePath }
            ]));
            const setOutput = (0, doubles_1.monitor)((0, doubles_1.method)());
            doubles_1.interceptor.module(actionsCoreModulePath, { getInput, setOutput });
            // (2) act
            const { run } = yield Promise.resolve().then(() => __importStar(require("./run")));
            yield run();
            // (3) assessment
            let log = doubles_1.monitor.log(getInput, { clear: true });
            (0, expected_1.default)(log.calls).equalTo(2);
            log = doubles_1.monitor.log(setOutput, { clear: true });
            (0, expected_1.default)(log.calls).equalTo(1);
            (0, expected_1.default)(log.call.args).equalTo(["skylink", skylink]);
            log = doubles_1.monitor.log(uploadFile, { clear: true });
            (0, expected_1.default)(log.calls).equalTo(1);
            (0, expected_1.default)(log.call.args).equalTo([testFilePath]);
        }));
        test("when dir exists, uploadDirectory() must be called and its skylink returned", () => __awaiter(void 0, void 0, void 0, function* () {
            const { SkynetClient } = yield Promise.resolve().then(() => __importStar(require("@skynetlabs/skynet-nodejs")));
            yield Promise.resolve().then(() => __importStar(require("@actions/core")));
            // (1) arrange
            const testDirPath = node_path_1.default.join(__dirname, "../../tests/data");
            const skylink = "sia://the-skylink";
            const uploadDirectory = (0, doubles_1.monitor)(doubles_1.method.returns(skylink));
            doubles_1.interceptor.module(skynetModulePath, {
                SkynetClient: doubles_1.constructor.returns((0, doubles_1.simulator)(SkynetClient, { uploadDirectory }))
            });
            const getInput = (0, doubles_1.monitor)((0, doubles_1.method)([
                { args: ["portal"], returns: portal },
                { args: ["path"], returns: testDirPath }
            ]));
            const setOutput = (0, doubles_1.monitor)((0, doubles_1.method)());
            doubles_1.interceptor.module(actionsCoreModulePath, { getInput, setOutput });
            // (2) act
            const { run } = yield Promise.resolve().then(() => __importStar(require("./run")));
            yield run();
            // (3) assessment
            let log = doubles_1.monitor.log(getInput, { clear: true });
            (0, expected_1.default)(log.calls).equalTo(2);
            log = doubles_1.monitor.log(setOutput, { clear: true });
            (0, expected_1.default)(log.calls).equalTo(1);
            (0, expected_1.default)(log.call.args).equalTo(["skylink", skylink]);
            log = doubles_1.monitor.log(uploadDirectory, { clear: true });
            (0, expected_1.default)(log.calls).equalTo(1);
            (0, expected_1.default)(log.call.args).equalTo([testDirPath]);
        }));
        test("when entry doesn't exist, error must be returned", () => __awaiter(void 0, void 0, void 0, function* () {
            const { SkynetClient } = yield Promise.resolve().then(() => __importStar(require("@skynetlabs/skynet-nodejs")));
            yield Promise.resolve().then(() => __importStar(require("@actions/core")));
            // (1) arrange
            doubles_1.interceptor.module(skynetModulePath, {
                SkynetClient: doubles_1.constructor.returns((0, doubles_1.simulator)(SkynetClient, {}))
            });
            const testFilePath = node_path_1.default.join(__dirname, "../../tests/data/unknown.txt");
            const getInput = (0, doubles_1.monitor)((0, doubles_1.method)([
                { args: ["portal"], returns: portal },
                { args: ["path"], returns: testFilePath }
            ]));
            const setFailed = (0, doubles_1.monitor)((0, doubles_1.method)());
            doubles_1.interceptor.module(actionsCoreModulePath, { getInput, setFailed });
            // (2) act
            const { run } = yield Promise.resolve().then(() => __importStar(require("./run")));
            yield run();
            // (3) assessment
            let log = doubles_1.monitor.log(getInput, { clear: true });
            (0, expected_1.default)(log.calls).equalTo(2);
            log = doubles_1.monitor.log(setFailed, { clear: true });
            (0, expected_1.default)(log.calls).equalTo(1);
            (0, expected_1.default)(log.call.args).it(0).like("ENOENT");
        }));
    });
});
//# sourceMappingURL=run.test.js.map