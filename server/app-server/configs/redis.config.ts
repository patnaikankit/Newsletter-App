import { Redis } from "ioredis";

class RedisConfig {
    static async connect(): Promise<Redis> {
        const redisClient = new Redis({
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT || "6379"),
            password: process.env.REDIS_PASSWORD,
        });

        redisClient.on("error", (error) => {
            console.error("Redis connection error:", error);
        });

        redisClient.on("connect", () => {
            console.log("Redis connected");
        });

        return redisClient;
    }
}

export default RedisConfig;

