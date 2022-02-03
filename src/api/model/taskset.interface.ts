import { ActionTypeEnum } from ".";

export interface ITaskset {
  actions: Actions;
  version: string;
  trigger: ActionTypeEnum;
}

export interface Action {
  inputs: Input;
  type: ActionTypeEnum;
  result: Result;
  runAfter: ActionTypeEnum;
}

export interface Input {
  /**HTTP Action */
  method?: string;
  uri?: string;
  body?: object;
  headers?: object;

  /**Execute_JS_Code */
  code?: string;
  parameters?: any;

  /**Email */
  to?: string[];
  subject?: string;
  message?: string;
}

export type Actions = {
  [key in ActionTypeEnum]: Action;
};

export interface Result {
  status: string; //'success' | 'fail'
  output: any;
}
