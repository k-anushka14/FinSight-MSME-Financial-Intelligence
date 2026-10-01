import { Router, type IRouter } from "express";
import healthRouter from "./health";
import finsightRouter from "./finsight";
import whatsappRouter from "./whatsapp";
import copilotRouter from "./copilot";

const router: IRouter = Router();

router.use((_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

router.use(healthRouter);
router.use(whatsappRouter);
router.use(copilotRouter);
router.use(finsightRouter);

export default router;
