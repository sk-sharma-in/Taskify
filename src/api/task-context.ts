import { ActionTypeEnum, Action } from "./model";
import { ExecuteJSStrategy } from "./task-strategy/execute-js-strategy";
import { HTTPStrategy } from "./task-strategy/http-strategy";
import { SendMailStrategy } from "./task-strategy/send-mail-strategy";
import { ITaskStrategy } from "./task-strategy/task-strategy.interface";
import { Logger } from "../logger";

export class TaskContext {
  private taskStrategyMap: Map<ActionTypeEnum, ITaskStrategy>;
  constructor() {
    this.taskStrategyMap = new Map<ActionTypeEnum, ITaskStrategy>();
    this.context();
  }

  public async executeStrategy(
    actionType: ActionTypeEnum,
    action: Action,
    taskId: string,
    prevResult?: any
  ) {
    Logger.info({ taskId, actionType }, "Executing Task Strategy");
    return await this.taskStrategyMap
      .get(actionType)
      .executeTask(action, taskId, prevResult);
  }

  private context() {
    this.taskStrategyMap.set(ActionTypeEnum.Email, new SendMailStrategy());
    this.taskStrategyMap.set(ActionTypeEnum.HTTP, new HTTPStrategy());
    this.taskStrategyMap.set(
      ActionTypeEnum.Execute_JS_Code,
      new ExecuteJSStrategy()
    );

    // this.taskStrategyMap.get(ActionTypeEnum.Email).executeTask(null);
  }
}
