from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from screener import run_screener
from data_sources import (
    get_stock_info, get_quotes, get_market_overview, get_sectors,
    get_history, get_most_volatile, get_most_active, get_biggest_losers,
    get_after_hours_movers, get_short_squeeze_candidates, get_stock_news,
    ALL_UNIVERSE
)

app = Flask(__name__)
CORS(app)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/screener")
def api_screener():
    filters = {
        "min_volume": int(request.args.get("min_volume", 0)),
        "sector": request.args.get("sector"),
        "min_price": float(request.args.get("min_price", 0)),
        "max_price": float(request.args.get("max_price", 0)) or None,
        "sort_by": request.args.get("sort", "volume"),
        "sort_order": request.args.get("order", "desc"),
    }
    return jsonify(run_screener(**filters))


@app.route("/api/quote/<ticker>")
def api_quote(ticker):
    ticker = ticker.upper()
    info = get_stock_info(ticker)
    if info:
        return jsonify(info)
    quotes = get_quotes([ticker])
    q = quotes.get(ticker)
    if q:
        return jsonify(q)
    return jsonify({"error": "not found"}), 404


@app.route("/api/watchlist/quotes")
def api_watchlist_quotes():
    tickers_param = request.args.get("tickers", "")
    if not tickers_param:
        return jsonify({})
    tickers = [t.strip().upper() for t in tickers_param.split(",") if t.strip()]
    quotes = get_quotes(tickers)
    return jsonify(quotes)


@app.route("/api/market-overview")
def api_market_overview():
    return jsonify(get_market_overview())


@app.route("/api/sectors")
def api_sectors():
    return jsonify(get_sectors())


@app.route("/api/history/<ticker>")
def api_history(ticker):
    period = request.args.get("period", "1mo")
    data = get_history(ticker.upper(), period)
    return jsonify(data)


@app.route("/api/volatile")
def api_volatile():
    limit = int(request.args.get("limit", 20))
    return jsonify(get_most_volatile(limit))


@app.route("/api/active")
def api_active():
    limit = int(request.args.get("limit", 20))
    return jsonify(get_most_active(limit))


@app.route("/api/losers")
def api_losers():
    limit = int(request.args.get("limit", 20))
    return jsonify(get_biggest_losers(limit))


@app.route("/api/after-hours")
def api_after_hours():
    limit = int(request.args.get("limit", 20))
    return jsonify(get_after_hours_movers(limit))


@app.route("/api/short-squeeze")
def api_short_squeeze():
    limit = int(request.args.get("limit", 20))
    return jsonify(get_short_squeeze_candidates(limit))


@app.route("/api/news/<ticker>")
def api_news(ticker):
    limit = int(request.args.get("limit", 10))
    return jsonify(get_stock_news(ticker.upper(), limit))


@app.route("/api/search")
def api_search():
    q = request.args.get("q", "").upper()
    if not q:
        return jsonify([])
    matches = [t for t in ALL_UNIVERSE if q in t]
    return jsonify(matches[:10])


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
