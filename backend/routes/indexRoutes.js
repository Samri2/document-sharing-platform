import { Router } from "express";
import docRouter from "./docRoutes.js";
import authRoute from "./authRoutes.js";
import adminRoute from "./adminRoutes.js";

const indexRouter = Router()

indexRouter.use("/auth", authRoute);
indexRouter.use("/admin", adminRoute);
indexRouter.use("/documents", docRouter);

export default indexRouter