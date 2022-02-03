import axios, { Method } from "axios";
import { BadRequestError } from "../../error";
import { Action, Result } from "../model";
import { TaskStrategy } from "./task-strategy";
import { ITaskStrategy } from "./task-strategy.interface";
import nodemailer from "nodemailer";
import { Logger } from "../../logger";

export class SendMailStrategy extends TaskStrategy implements ITaskStrategy {
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
    // ];
    Logger.info({ taskId, action }, "Executing Task SendMailStrategy");
    try {
      /** Dummy Mail trap acount for testing */
      const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASS,
        },
      });

      const mailOptions = {
        from: '"Taskify Runner" <from@example.com>',
        to: action.inputs.to.join(","),
        subject: "Taskify Runner Update",
        text: `${taskId} task-set completed successfully`,
        html: `<br> ${taskId} task-set completed successfully<br/>
                <br>Results - <br/>
                <br>${JSON.stringify(prevResult)}`,
      };
      await transport.sendMail(mailOptions);
      return { status: "success", output: "mail sent" };
    } catch (error) {
      Logger.error({ error: error.toString(), stack: error.stack });
      throw new Error("Failure during sending the email");
    }
  }
}

// //Send Email
