import { createApp } from './app';
import { env } from './config/env';

const app = createApp();

app.listen(env.port, () => {
  // Keep logs free of secrets/tokens — startup line only.
  // eslint-disable-next-line no-console
  console.log(`Bajaj Angular Fresher Demo API running on http://localhost:${env.port}`);
});
