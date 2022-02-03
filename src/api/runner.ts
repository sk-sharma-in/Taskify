import { ActionTypeEnum, ITaskset, RunnerStatusEnum } from "./model";
import { v4 } from "uuid";
import { TaskContext } from "./task-context";
import { Logger } from "../logger";
import { storage } from "./storage";

export class Runner {
  public result: any = {};
  public status: RunnerStatusEnum = RunnerStatusEnum.Open;
  public taskId: string;
  public constructor(public taskSet: ITaskset) {
    this.taskSet = taskSet;
    this.taskId = v4();
  }

  public async createAndStart() {
    this.status = RunnerStatusEnum.In_Progress;
    const trigger = this.taskSet.trigger;
    const taskContext = new TaskContext();
    Logger.info({ context: taskContext }, "Context");
    storage.set(this.taskId, {
      taskId: this.taskId,
      status: this.status,
      taskSet: this.taskSet,
    });
    await this.executeTaskSet(trigger, taskContext);
  }

  private async executeTaskSet(trigger: ActionTypeEnum, context: TaskContext) {
    if (trigger == undefined) {
      this.status = RunnerStatusEnum.Completed;
      storage.set(this.taskId, {
        taskId: this.taskId,
        status: this.status,
        taskSet: this.taskSet,
      });
      return;
    }
    try {
      let result = await context.executeStrategy(
        trigger,
        this.taskSet.actions[trigger],
        this.taskId,
        this.result[this.taskSet.actions[trigger].runAfter]
      );
      this.result[trigger] = result;
      storage.set(this.taskId, {
        taskId: this.taskId,
        status: this.status,
        taskSet: this.taskSet,
        result: this.result,
      });
      if (result.status === "success") {
        const nextActionKey = Object.keys(this.taskSet.actions).find(
          (key) => this.taskSet.actions[key].runAfter === trigger
        );
        await this.executeTaskSet(nextActionKey as ActionTypeEnum, context);
      } else {
        this.status = RunnerStatusEnum.Failed;
        storage.set(this.taskId, {
          taskId: this.taskId,
          status: this.status,
          taskSet: this.taskSet,
        });
        return;
      }
    } catch (error) {
      Logger.error({ error: error.toString(), stack: error.stack });
      this.status = RunnerStatusEnum.Failed;
      storage.set(this.taskId, {
        taskId: this.taskId,
        status: this.status,
        taskSet: this.taskSet,
      });
    }
  }
}
