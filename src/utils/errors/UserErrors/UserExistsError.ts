export class UserExistsError extends Error {

    public statusCode = 409;
    public status: string;

    constructor() {

      super('User with such username already exists');
      this.status = `${this.statusCode}.startsWith('4') ? 'fail' : 'error'`;
      Error.captureStackTrace(this, this.constructor);

    }
}  