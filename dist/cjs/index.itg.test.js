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
Object.defineProperty(exports, "__esModule", { value: true });
const node_os_1 = __importDefault(require("node:os"));
const node_path_1 = __importDefault(require("node:path"));
const promises_1 = __importDefault(require("node:fs/promises"));
const index_1 = require("./index");
const expected_1 = __importDefault(require("@akromio/expected"));
const expected_fs_1 = __importDefault(require("@akromio/expected-fs"));
expected_1.default.plugin(expected_fs_1.default);
suite("upload file", () => {
    const portal = "https://web3portal.com";
    const outputFile = node_path_1.default.join(node_os_1.default.tmpdir(), "GITHUB_OUTPUT");
    setup(() => __awaiter(void 0, void 0, void 0, function* () {
        yield promises_1.default.writeFile(outputFile, ""); // needed by core.setOutput()
    }));
    test("if file exists, this must be uploaded and output set", () => __awaiter(void 0, void 0, void 0, function* () {
        // (1) arrange
        const testFilePath = node_path_1.default.join(__dirname, "../../tests/data/hello-world.txt");
        process.env.INPUT_PORTAL = portal;
        process.env.INPUT_PATH = testFilePath;
        process.env.GITHUB_OUTPUT = outputFile;
        // (2) act
        yield (0, index_1.run)();
        // (3) assessment
        expected_1.default.file(outputFile).toContain("sia://");
    }));
    test("if file doesn't exist, process.exitCode must be set to 1", () => __awaiter(void 0, void 0, void 0, function* () {
        // (1) arrange
        const testFilePath = node_path_1.default.join(__dirname, "../../tests/data/unknown.txt");
        process.env.INPUT_PORTAL = portal;
        process.env.INPUT_PATH = testFilePath;
        process.env.GITHUB_OUTPUT = outputFile;
        // (2) act
        yield (0, index_1.run)();
        // (3) assessment
        expected_1.default.file(outputFile).toBeEmpty();
        (0, expected_1.default)(process.exitCode).equalTo(1);
    }));
});
//# sourceMappingURL=index.itg.test.js.map