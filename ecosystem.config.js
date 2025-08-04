module.exports = {
  apps: [
    {
      name: "renx-play",
      script: "dist/server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        DATABASE_URL: "file:./dev.db",
        JWT_SECRET: "renx-play-secret-key-production"
      }
    }
  ]
};