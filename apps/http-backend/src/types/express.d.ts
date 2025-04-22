declare namespace Express {
  export interface Request {
    userId?: string; // Make it optional if not always present
  }
}
