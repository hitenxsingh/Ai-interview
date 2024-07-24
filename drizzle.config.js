/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://ai-interview_owner:KzgLewFmC92U@ep-yellow-wave-a5edkv5c.us-east-2.aws.neon.tech/ai-interview?sslmode=require',
    }
  };