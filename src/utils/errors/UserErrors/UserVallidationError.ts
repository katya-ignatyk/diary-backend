export class UserVallidationError extends Error {

    public statusCode = 400;
    public status: string;

    constructor(message : string) {

      super(message);
      this.status = `${this.statusCode}.startsWith('4') ? 'fail' : 'error'`;
      Error.captureStackTrace(this, this.constructor);
      
    }
}  