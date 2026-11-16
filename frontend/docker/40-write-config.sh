#!/bin/sh
# Runs at container start (nginx image's /docker-entrypoint.d hook).
# Writes the backend URL into config.js so the same image works anywhere.
set -eu

: "${API_URL:=http://localhost:3000}"
escaped=$(printf '%s' "$API_URL" | sed 's/\\/\\\\/g; s/"/\\"/g')
printf 'window.__APP_CONFIG__ = { API_URL: "%s" };\n' "$escaped" > /usr/share/nginx/html/config.js
echo "$0: API_URL=$API_URL"
