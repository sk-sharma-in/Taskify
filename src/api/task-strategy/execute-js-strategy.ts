import { Logger } from "../../logger";
import { Action, Result } from "../model";
import { TaskStrategy } from "./task-strategy";
import { ITaskStrategy } from "./task-strategy.interface";

export class ExecuteJSStrategy extends TaskStrategy implements ITaskStrategy {
  async executeTask(
    action: Action,
    taskId: string,
    prevResult?: any
  ): Promise<Result> {
    /** Validation checks can be enabled the way demontrated in http-strategy */
    // const mandatoryProps = ['action.inputs', 'action.inputs.uri', 'action.inputs.method'];
    // const invalidProps = [
    //     'action.inputs.code', 'action.inputs.parameters',
    //     'action.inputs.to', 'action.inputs.subject', 'action.inputs.message'
    // ]
    Logger.info({ taskId, action, prevResult }, "Executing Task ExecuteJSStrategy");

    const anonymFunc = new Function(
      action.inputs.parameters[0], // Assuming the parameter count to 1 for sake of demo
      action.inputs.code
    );
    const output = anonymFunc(prevResult['output'])
    Logger.info({ taskId, action, anonymFunc, output }, "ExecuteJSStrategy results");
    return { status: "success", output  };
  }
}
