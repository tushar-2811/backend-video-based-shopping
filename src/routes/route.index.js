import { Router } from "express";
import apiRouter from "./api/api.index.js";


const indexRouter = Router();

indexRouter.use('/api' , apiRouter);

export default indexRouter;