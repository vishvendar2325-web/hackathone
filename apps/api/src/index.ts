import { createApp } from './app';
import { config } from './config/index';

const app = createApp();

// Only listen if not imported as a middleware module
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(config.port, '0.0.0.0', () => {
    console.log(`[FOCUSFLOW API] Server listening on http://0.0.0.0:${config.port}`);
    console.log(`[FOCUSFLOW API] Health check available at http://0.0.0.0:${config.port}/api/v1/health`);
  });

  process.on('SIGTERM', () => {
    server.close(() => console.log('[FOCUSFLOW API] Process terminated gracefully'));
  });
}

export { app };
export default app;
