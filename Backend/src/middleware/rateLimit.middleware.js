const createRateLimiter = ({
  windowMs = 60 * 1000,
  maxRequests = 10,
  message = "Too many requests. Please try again later.",
} = {}) => {
  const hits = new Map();

  return (req, res, next) => {
    const key = req.user?.id || req.ip;
    const now = Date.now();
    const userHits = hits.get(key) || [];
    const recentHits = userHits.filter((timestamp) => now - timestamp < windowMs);

    if (recentHits.length >= maxRequests) {
      return res.status(429).json({ message });
    }

    recentHits.push(now);
    hits.set(key, recentHits);

    next();
  };
};

module.exports = createRateLimiter;
