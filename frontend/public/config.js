// Runtime configuration. In Docker, this file is rewritten at container start
// from the API_URL environment variable. An empty API_URL means "same origin"
// (the Vite dev server proxies /api to the backend).
window.__APP_CONFIG__ = { API_URL: '' };
