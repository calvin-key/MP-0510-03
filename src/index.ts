import express, { NextFunction, Request, Response } from "express";
import { PORT } from "./config";
import cors from "cors";
import sampleRouter from "./routes/sample.router";
import eventRouter from "./routes/event.router";
import authRouter from "./routes/auth.router";
import voucherRouter from "./routes/voucher.router";

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use("/samples", sampleRouter);
app.use("/events", eventRouter);
app.use("/auth", authRouter);
app.use("/vouchers", voucherRouter)

// middleware error
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).send(err.message);
});

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});
