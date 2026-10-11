#!/usr/bin/env bash
# Starts the local site + mocked backend, runs the k6 test, writes the report,
# and stops what it started.
#
#   npm run loadtest                 # standard: 20 -> 50 -> 100 users, ~13 min
#   PROFILE=stress npm run loadtest  # 100 -> 800 users, ~13 min
#   PROFILE=smoke npm run loadtest   # 30 s check that everything works
#
# Needs k6 (`brew install k6`) and an up-to-date dist/ (`npm run build`).
# Results land in loadtest/results/ (gitignored).
set -euo pipefail
cd "$(dirname "$0")/.."

PROFILE="${PROFILE:-standard}"
command -v k6 >/dev/null || { echo "k6 is not installed: brew install k6" >&2; exit 1; }
[ -f dist/index.html ] || { echo "No dist/. Run npm run build first." >&2; exit 1; }

mkdir -p loadtest/results
STAMP="$(date +%Y%m%d-%H%M%S)-$PROFILE"
LOG="loadtest/results/$STAMP"

for port in 8787 8788; do
  if curl -s -o /dev/null "http://127.0.0.1:$port/"; then
    echo "Port $port is already in use. Stop whatever is running there (npm run dev:backend?) first." >&2
    exit 1
  fi
done

# --local keeps both Workers on this machine; distinct inspector ports let them run side by side.
npx wrangler dev -c loadtest/wrangler.mock-backend.toml --local --ip 127.0.0.1 --port 8787 \
  --inspector-port 9231 --show-interactive-dev-session=false --log-level=warn >"$LOG-backend.log" 2>&1 &
BACKEND=$!
npx wrangler dev -c loadtest/wrangler.site.toml --local --ip 127.0.0.1 --port 8788 \
  --inspector-port 9232 --show-interactive-dev-session=false --log-level=warn >"$LOG-site.log" 2>&1 &
SITE=$!
# Killing npx alone can leave wrangler's workerd children running, so match the configs too.
trap 'kill $BACKEND $SITE 2>/dev/null; pkill -f "loadtest/wrangler\\." 2>/dev/null || true' EXIT

for _ in $(seq 1 60); do
  if curl -sf -o /dev/null http://127.0.0.1:8787/health && curl -sf -o /dev/null http://127.0.0.1:8788/; then
    break
  fi
  sleep 1
done
curl -sf -o /dev/null http://127.0.0.1:8787/health || { echo "Backend did not start; see $LOG-backend.log" >&2; exit 1; }
curl -sf -o /dev/null http://127.0.0.1:8788/ || { echo "Site did not start; see $LOG-site.log" >&2; exit 1; }

# k6 exits non-zero when a threshold fails; still write the report.
set +e
PROFILE="$PROFILE" k6 run --out "csv=$LOG.csv.gz" loadtest/shopper.js | tee "$LOG-k6.txt"
STATUS=${PIPESTATUS[0]}
set -e

curl -s http://127.0.0.1:8787/__mock/stats >"$LOG-mock-stats.json" || true
node loadtest/report.mjs "$LOG.csv.gz" "$LOG-report.md" "$LOG-mock-stats.json"
echo
echo "Report: $LOG-report.md"
exit "$STATUS"
