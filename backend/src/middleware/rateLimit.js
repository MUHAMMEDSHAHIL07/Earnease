import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    status: 429,
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});


export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 5,
  message: {
    status: 429,
    message: "Too many login attempts. Please try again in 10 minutes.",
  },
});
