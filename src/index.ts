import express, { NextFunction, Request, Response } from "express";
import { PORT } from "./config";
import cors from "cors";
import sampleRouter from "./routes/sample.router";
import eventRouter from "./routes/event.router";
import authRouter from "./routes/auth.router";
import voucherRouter from "./routes/voucher.router";
import userRouter from "./routes/user.router";
import eventCategoryRouter from "./routes/event-category.router";
import couponRouter from "./routes/coupon.router";
import referralRouter from "./routes/referral.router";
import attendeeListRouter from "./routes/attendee-list.router";
import statisticRouter from "./routes/statistic.router";

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
app.use("/event-categories", eventCategoryRouter);
app.use("/coupons", couponRouter);
app.use("/referrals", referralRouter);
app.use("/attendees", attendeeListRouter);
app.use("/statistic", statisticRouter);

// middleware error
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).send(err.message);
});

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});
