import { JWT_SECRET,COOKIE_NAME } from "./constant.js";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


console.log("JWT_SECRET", JWT_SECRET);
console.log("COOKIE_NAME", COOKIE_NAME);

export const createToken = (username: string, role: string, expiresIn: string) => {
  const payload = { username, role};
  const token = jwt.sign(payload, JWT_SECRET,  {
    expiresIn,
  });
  return token;
};


export const verifyToken = async (
  
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const token = req.signedCookies[COOKIE_NAME];
  
  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Token Not Received" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);

    res.locals.jwtData = decoded;

    next();
  } catch (error) {
    console.error("JWT verification error:", error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token Expired" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid Token" });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};


export const verifyTokenUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies[COOKIE_NAME];

  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Token Not Received" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    res.locals.jwtData = decoded;

    if (res.locals.jwtData.role!== 'user') {
      return res.status(403).json({ message: "Access denied. Not a user." });
    }
    next();
  } catch (error) {
    console.error("JWT verification error:", error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token Expired" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid Token" });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const verifyTokenAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies[ COOKIE_NAME];

  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Token Not Received" });
  }

  try {
    const decoded = jwt.verify(token,  JWT_SECRET as string);

    res.locals.jwtData = decoded;

    if (res.locals.jwtData.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Not an Admin." });
    }

    next();
  } catch (error) {
    console.error("JWT verification error:", error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token Expired" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid Token" });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};