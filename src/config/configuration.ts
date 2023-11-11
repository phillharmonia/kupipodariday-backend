export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3002,
  },
  database: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER || 'student',
    password: process.env.DB_PASSWORD || 'student',
    name: process.env.DB_NAME || 'posts',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'super_secret',
    ttl: parseInt(process.env.JWT_TTL, 10) || 30000
  },
});
