"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const cors_1 = __importDefault(require("cors"));
const sample_router_1 = __importDefault(require("./routes/sample.router"));
const event_router_1 = __importDefault(require("./routes/event.router"));
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const voucher_router_1 = __importDefault(require("./routes/voucher.router"));
const transaction_router_1 = __importDefault(require("./routes/transaction.router"));
require("./lib/cronJob");
const user_router_1 = __importDefault(require("./routes/user.router"));
const event_category_router_1 = __importDefault(require("./routes/event-category.router"));
const review_router_1 = __importDefault(require("./routes/review.router"));
const coupon_router_1 = __importDefault(require("./routes/coupon.router"));
const statistic_router_1 = __importDefault(require("./routes/statistic.router"));
const update_transaction_status_router_1 = __importDefault(require("./routes/update-transaction-status.router"));
const attendee_router_1 = __importDefault(require("./routes/attendee.router"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//routes
app.use("/samples", sample_router_1.default);
app.use("/auth", auth_router_1.default);
app.use("/user", user_router_1.default);
app.use("/events", event_router_1.default);
app.use("/auth", auth_router_1.default);
app.use("/vouchers", voucher_router_1.default);
app.use("/transactions", transaction_router_1.default);
app.use("/event-categories", event_category_router_1.default);
app.use("/reviews", review_router_1.default);
app.use("/coupons", coupon_router_1.default);
app.use("/statistic", statistic_router_1.default);
app.use("/update-transaction-status", update_transaction_status_router_1.default);
app.use("/attendees", attendee_router_1.default);
// middleware error
app.use((err, req, res, next) => {
    res.status(400).send(err.message);
});
app.listen(config_1.PORT, () => {
    console.log(`server running on PORT ${config_1.PORT}`);
});
