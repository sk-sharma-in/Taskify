import axios, { Method } from "axios";
import { Logger } from "../../logger";
import { BadRequestError } from "../../error";
import { Action, Result } from "../model";
import { TaskStrategy } from "./task-strategy";
import { ITaskStrategy } from "./task-strategy.interface";

export class HTTPStrategy extends TaskStrategy implements ITaskStrategy {
  async executeTask(action: Action, taskId: string): Promise<Result> {
    const mandatoryProps = [
      "action.inputs",
      "action.inputs.uri",
      "action.inputs.method",
    ];
    const invalidProps = [
      "action.inputs.code",
      "action.inputs.parameters",
      "action.inputs.to",
      "action.inputs.subject",
      "action.inputs.message",
    ];
    Logger.info({ taskId, action }, "Executing Task HTTPStrategy");
    if (this.isActionValid(action, mandatoryProps, invalidProps)) {
      const httpResp = await axios({
        method: action.inputs.method as Method,
        url: action.inputs.uri,
        data: { ...action.inputs.body },
        headers: { ...action.inputs.headers },
      });
      Logger.info({ taskId, action, httpResp:httpResp.data }, "HTTPStrategy results");
      return {
        status: httpResp.status == 200 ? "success" : "fail",
        output: httpResp.data,
      };
    } else {
      Logger.error({ taskId, action }, "Error while executing step HTTP");
      throw new BadRequestError("Invalid action passed for HTTP execution");
    }
  }
}
