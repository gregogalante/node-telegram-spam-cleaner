# Node Telegram spam cleaner

Node.js server used to clean spam messages on telegram groups.

## Env variables

- NODE_PORT: port to listen with web server.
- NODE_BASE_PATH: base path used to respond to requests.
- TG_APP_API_ID: telegram app api id.
- TG_APP_API_HASH: telegram app api hash.
- TG_SESSION: telegram session string.
- TG_GROUP_IDS: telegram app channel ids (separated with comma).