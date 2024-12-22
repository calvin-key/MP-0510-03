"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const cors_1 = __importDefault(require("cors"));
const sample_router_1 = __importDefault(require("./routes/sample.router"));
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//routes
app.use("/samples", sample_router_1.default);
app.use("/auth", auth_router_1.default);
// middleware error
app.use((err, req, res, next) => {
    res.status(400).send(err.message);
});
app.listen(config_1.PORT, () => {
    console.log(`server running on PORT ${config_1.PORT}`);
});
