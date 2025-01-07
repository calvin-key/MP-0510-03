import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import sampleRouter from "./routes/sample.router";
import eventRouter from "./routes/event.router";
import authRouter from "./routes/auth.router";
import voucherRouter from "./routes/voucher.router";
import transactionRouter from "./routes/transaction.router";
import "./lib/cronJob";
import userRouter from "./routes/user.router";
import eventCategoryRouter from "./routes/event-category.router";
import reviewRouter from "./routes/review.router";
import couponRouter from "./routes/coupon.router";
import statisticRouter from "./routes/statistic.router";
import updateTransactionStatusRouter from "./routes/update-transaction-status.router";
import attendeeRouter from "./routes/attendee.router";

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use("/samples", sampleRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/events", eventRouter);
app.use("/auth", authRouter);
app.use("/vouchers", voucherRouter);
app.use("/transactions", transactionRouter);
app.use("/event-categories", eventCategoryRouter);
app.use("/reviews", reviewRouter);
app.use("/coupons", couponRouter);
app.use("/statistic", statisticRouter);
app.use("/update-transaction-status", updateTransactionStatusRouter);
app.use("/attendees", attendeeRouter);

// middleware error
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).send(err.message);
});

export default app;
