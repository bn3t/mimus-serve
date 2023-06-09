import { RequestModel } from "./request-model";

/**
 * The context object that is passed to each render class in Mimus Serve.
 * It contains information about the current request.
 */
export interface Context {
  request: RequestModel;
}
