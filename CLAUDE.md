# Trading Terminal

Bloomberg-style stock trading terminal — local web app.

## Stack

- **Backend**: Python Flask (`app.py`) on port 8080
- **Data**: yfinance library for all market data (quotes, history, fundamentals, news)
- **Frontend**: Vanilla HTML/CSS/JS — no build step, no frameworks

## Project Structure

```
app.py              — Flask routes (API + page serve)
data_sources.py     — All data fetching, caching, squeeze analysis, news
screener.py         — Stock screening engine with filters
requirements.txt    — Python deps: flask, flask-cors, yfinance
templates/
  index.html        — Single-page terminal layout
static/css/
  terminal.css      — Bloomberg dark theme (JetBrains Mono, orange accents)
static/js/
  app.js            — Main controller, keyboard shortcuts, detail panel
  panels.js         — Tab panels: volatile, active, losers, after-hours, squeeze, learn
  screener.js       — Screener table with sort and filters
  watchlist.js      — Watchlist with localStorage + sparklines
  alerts.js         — Price alerts with browser notifications
  charts.js         — Canvas-based sparklines and line charts
```

## How to Run

```bash
cd ~/trading-terminal
source venv/bin/activate
python app.py
# http://localhost:8080
```

If venv doesn't exist: `python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt`

## Key Design Decisions

- `data_sources.py` uses an in-memory `DataCache` with TTL and thread locking
- `ThreadPoolExecutor` for parallel stock info fetching (10 workers)
- `yf.download()` for bulk quotes, `yf.Ticker.info` for individual detailed data
- Short squeeze scoring: composite 0-100 from SI%, days to cover, volume surge, momentum, float size
- All frontend state (watchlist, alerts) persists in localStorage
- No external charting library — canvas-based charts for speed

## Conventions

- API endpoints under `/api/` return JSON
- Frontend uses global objects: `App`, `Screener`, `Watchlist`, `Alerts`, `Panels`, `Charts`
- CSS variables defined in `:root` — dark theme with `--orange`, `--green`, `--red`
- Keyboard shortcuts: `/` search, `W` watchlist, `A` alerts, `R` refresh, `1-7` tabs
