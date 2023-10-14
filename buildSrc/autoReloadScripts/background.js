import querystring from 'querystring';
import browser from 'webextension-polyfill';
import Logger from './logger';
import Events from './events';

const logger = new Logger('AutoReload / Background');

logger.info('Connecting to SSE service...');
const port = querystring.parse(__resourceQuery.slice(1)).port;
const address = `http://localhost:${port}/__server_sent_events__`;
const eventSource = new EventSource(address);

eventSource.addEventListener(
  'open',
  (event) => logger.info(`SSE service connected!`, event),
  false
);
eventSource.addEventListener(
  'error',
  (event) =>
    logger.error(
      event.target.readyState === 0 // connecting
        ? 'Connecting to dev server! Is it running?'
        : event
    ),
  false
);

eventSource.addEventListener(Events.ReloadExtension, (event) => {
  logger.info('Extension will reload to update scripts...', event);
  browser.runtime.reload();
  eventSource.close();
});
