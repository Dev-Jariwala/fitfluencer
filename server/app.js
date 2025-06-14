// app.js
import express from 'express';
import session from "express-session";
import cors from "cors";
import cookieParser from 'cookie-parser';
import passport from "./config/passport.js";
import userRoutes from "./routes/user.routes.js";
import rolesRoutes from "./routes/roles.routes.js";
import configRoutes from "./routes/config.routes.js";
import plansRoutes from "./routes/plans.routes.js";
import commissionRoutes from "./routes/commission.routes.js";
import clientPaymentsRoutes from "./routes/clientPayments.routes.js";
import mealsRoutes from "./routes/meals.routes.js";
import commonRoutes from "./routes/common.routes.js";
import { verifyClientPayment } from './controllers/clientPayments.controllers.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://192.168.29.221:5173', "https://fitfluencer.ooguy.com:5173", "http://fitfluencer.ooguy.com:5173", 'http://localhost', "http://fitfluencer.ooguy.com:5001", "https://fitfluencer.ooguy.com", "http://fitfluencer.ooguy.com"],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.use("/api/imgs", express.static("uploads/imgs"));

app.use("/api/users", userRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/config", configRoutes);
app.use("/api/plans", plansRoutes);
app.use("/api/commission", commissionRoutes);
app.use("/api/client-payments", clientPaymentsRoutes);
app.use("/api/common", commonRoutes);
app.use("/api/meals", mealsRoutes);
app.post('/webhook/razorpay', verifyClientPayment);``

const port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});