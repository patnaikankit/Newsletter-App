import { Redis } from "@upstash/redis";

class RedisConfig {
    private static client: Redis | null = null;

    static async connect(): Promise<Redis> {
        if (!this.client) {
            this.client = new Redis({
                url: process.env.UPSTASH_REDIS_URL!,
                token: process.env.UPSTASH_REDIS_TOKEN!,
                // retry: (attempt: number) => {
                //     if (attempt > 5) {
                //         console.error("Redis failed after multiple attempts. Exiting...");
                //         process.exit(1);
                //     }
                //     const delay = Math.min(attempt * 500, 5000);
                //     console.warn(`Redis reconnecting attempt #${attempt}, retrying in ${delay}ms`);
                //     return delay;
                // },
            });

            console.log("Connected to Upstash Redis...");
        }
        return this.client;
    }
}

export default RedisConfig;
