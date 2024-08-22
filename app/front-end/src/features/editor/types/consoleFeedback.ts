export enum ConsoleFeedbackTypes {
  INFO = 'info',
  SUCCESS = 'succ',
  WARNING = 'warn',
  ERROR = 'errr',
}

export type ConsoleFeedback = {
  type: ConsoleFeedbackTypes;
  message: string;
  timestamp: string;
};
