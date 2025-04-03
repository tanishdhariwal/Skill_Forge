// src/middlewares/errorHandler.ts
import { Request, Response} from 'express';

const errorHandler = (err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
};

export default errorHandler;
