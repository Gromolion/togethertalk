export default () => ({
  postgres: {
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
});
