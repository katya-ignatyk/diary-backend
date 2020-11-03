import { Request, Response } from 'express';

export type IController<T extends string> = {
  [key in T] : (req : Request, res : Response) => Promise<void>;
}
