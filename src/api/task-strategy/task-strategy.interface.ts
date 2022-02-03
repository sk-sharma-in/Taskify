import { Action, Result } from "../model";
export interface ITaskStrategy {
  executeTask(
    action: Action,
    taskId: string,
    prevResult?: any
  ): Promise<Result>;
}
