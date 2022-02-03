import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { Runner } from "./runner";
import { storage } from "./storage";

const taskify = Router();

// Get a task set
taskify.get("/taskset/:ts_id", async (req, res, next) => {
  const task = await storage.get(req.params["ts_id"]);
  if (task) {
    res
      .status(StatusCodes.OK)
      .json({
        id: task["taskId"],
        status: task["status"],
        result: task["result"],
      });
  } else {
    res.status(StatusCodes.NOT_FOUND).json({ message: "Task not found" });
  }
  return;
});

// Create a task set
taskify.put("/taskset", async (req, res, next) => {
  let runner = new Runner(req.body);
  res
    .status(StatusCodes.OK)
    .json({ taskId: runner.taskId, status: runner.status });
  runner.createAndStart();
  return;
});

export { taskify as taskifyRoutes };
