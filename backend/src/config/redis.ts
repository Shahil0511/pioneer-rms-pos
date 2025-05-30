import Redis from "ioredis";

class RedisClient {
  private static instance: Redis | null = null;

  private constructor() {}

  public static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis({
        host: "localhost",
        port: 6379,
        password: "",
        db: 0,
        retryStrategy: (times) => {
          if (times >= 3) {
            return undefined;
          }
          return Math.min(times * 50, 2000);
        },
      });
    }
    return RedisClient.instance;
  }

  public static async getValue(key: string): Promise<string | null> {
    const redis = RedisClient.getInstance();
    return await redis.get(key);
  }

  public static async setValue(
    key: string,
    value: string,
    expirationInSeconds: number = 3600
  ): Promise<void> {
    const redis = RedisClient.getInstance();
    await redis.set(key, value, "EX", expirationInSeconds);
  }
}

export { RedisClient };
