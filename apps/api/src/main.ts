import { env } from './config/env.js';
import { buildServer } from './server.js';

const app = buildServer();

app.listen({ port: env.PORT, host: env.HOST }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
