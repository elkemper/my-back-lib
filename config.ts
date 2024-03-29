export default {
  port: parseInt(process.env.PORT) || 3214,
  dbPath: process.env.DB_PATH || '',
  archivePath: process.env.ARCHIVE_PATH || '',
  defaultPerPage: 50,
  adminUsername: process.env.ADMIN_USERNAME || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  salt: 10,
  sessionCheckingTimeout: 24 * 60 * 60 * 1000,
  jwtExpiration: '1d',
  jwtSecret: process.env.TOKEN_SECRET || '',
  maxRequestsIn10sec: parseInt(process.env.REQUEST_RATE_LIMIT) || 20,
  backendUnderSlashApi: process.env.SLASH_API && process.env.SLASH_API .toLowerCase() === 'true'
};
