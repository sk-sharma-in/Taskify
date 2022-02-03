import { isEmpty } from "lodash";
import { Action, Result } from "../model";
export abstract class TaskStrategy {
  isActionValid(
    action: Action,
    mandatoryProps: string[],
    invalidProps: string[]
  ): boolean {
    if (mandatoryProps.length === 0) {
      return false;
    }

    return (
      mandatoryProps.filter((key) => isEmpty(action[key])).length === 0 ||
      invalidProps.filter((key) => !isEmpty(action[key])).length === 0
    );
  }
}
