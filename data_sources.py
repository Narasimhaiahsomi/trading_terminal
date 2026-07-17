import yfinance as yf
import threading
import time
from datetime import datetime, timezone
from concurrent.futures import ThreadPoolExecutor, as_completed

SP500_TOP = [
    "AAPL", "MSFT", "AMZN", "NVDA", "GOOGL", "META", "BRK-B", "UNH", "XOM", "LLY",
    "JPM", "JNJ", "V", "PG", "MA", "AVGO", "HD", "CVX", "MRK", "ABBV",
    "COST", "PEP", "KO", "ADBE", "WMT", "MCD", "CRM", "CSCO", "TMO", "ACN",
    "ABT", "BAC", "NFLX", "AMD", "LIN", "DHR", "CMCSA", "PFE", "ORCL", "NKE",
    "TXN", "PM", "UNP", "INTC", "WFC", "RTX", "QCOM", "NEE", "HON", "LOW",
]

DOW30 = [
    "AAPL", "AMGN", "AXP", "BA", "CAT", "CRM", "CSCO", "CVX", "DIS", "DOW",
    "GS", "HD", "HON", "IBM", "INTC", "JNJ", "JPM", "KO", "MCD", "MMM",
    "MRK", "MSFT", "NKE", "PG", "TRV", "UNH", "V", "VZ", "WBA", "WMT",
]

NASDAQ_TOP = [
    "AAPL", "MSFT", "AMZN", "NVDA", "GOOGL", "META", "AVGO", "COST", "TSLA", "NFLX",
    "AMD", "ADBE", "PEP", "CSCO", "INTC", "CMCSA", "TXN", "QCOM", "TMUS", "AMGN",
    "INTU", "AMAT", "ISRG", "HON", "BKNG", "LRCX", "SBUX", "ADP", "MDLZ", "GILD",
    "ADI", "VRTX", "REGN", "PANW", "SNPS", "KLAC", "CDNS", "MELI", "CRWD", "PYPL",
    "MAR", "MNST", "ORLY", "FTNT", "MRVL", "ABNB", "CTAS", "DXCM", "WDAY", "DASH",
]

SHORT_SQUEEZE_CANDIDATES = [
    "GME", "AMC", "BBBY", "SPCE", "CLOV", "WISH", "SOFI", "PLTR", "BB", "NOK",
    "MARA", "RIOT", "UPST", "LCID", "RIVN", "DKNG", "SNAP", "HOOD", "RBLX", "COIN",
    "AFRM", "PATH", "PARA", "SWN", "SIRI", "AAL", "DAL", "UAL", "CCL", "RCL",
    "CVNA", "W", "BYND", "PTON", "ZM", "DOCU", "CRSR", "SKLZ", "OPEN", "LMND",
]

ALL_UNIVERSE = sorted(set(SP500_TOP + DOW30 + NASDAQ_TOP + SHORT_SQUEEZE_CANDIDATES))

INDICES = {
    "^GSPC": "S&P 500",
    "^IXIC": "NASDAQ",
    "^DJI": "DOW 30",
    "^RUT": "Russell 2000",
    "^VIX": "VIX",
}

SECTOR_ETFS = {
    "XLK": "Technology", "XLF": "Financials", "XLV": "Health Care",
    "XLY": "Consumer Disc.", "XLP": "Consumer Staples", "XLE": "Energy",
    "XLI": "Industrials", "XLB": "Materials", "XLRE": "Real Estate",
    "XLU": "Utilities", "XLC": "Communication",
}


class DataCache:
    def __init__(self):
        self._cache = {}
        self._lock = threading.Lock()

    def get(self, key, max_age=30):
        with self._lock:
            if key in self._cache:
                data, ts = self._cache[key]
                if time.time() - ts < max_age:
                    return data
        return None

    def set(self, key, data):
        with self._lock:
            self._cache[key] = (data, time.time())


cache = DataCache()


def _safe_float(val):
    try:
        f = float(val)
        return round(f, 2) if f == f else 0.0
    except (TypeError, ValueError):
        return 0.0


def _safe_int(val):
    try:
        return int(float(val))
    except (TypeError, ValueError):
        return 0


def _fetch_batch(tickers, max_age=30):
    cache_key = f"batch_{'_'.join(sorted(tickers))}"
    cached = cache.get(cache_key, max_age)
    if cached is not None:
        return cached
    try:
        data = yf.download(tickers, period="1d", group_by="ticker", progress=False, threads=True)
        result = {}
        for ticker in tickers:
            try:
                row = data if len(tickers) == 1 else data[ticker]
                if row.empty:
                    continue
                last = row.iloc[-1]
                result[ticker] = {
                    "open": _safe_float(last.get("Open")),
                    "high": _safe_float(last.get("High")),
                    "low": _safe_float(last.get("Low")),
                    "close": _safe_float(last.get("Close")),
                    "volume": _safe_int(last.get("Volume")),
                }
            except Exception:
                continue
        cache.set(cache_key, result)
        return result
    except Exception:
        return {}


def get_stock_info(ticker):
    cache_key = f"info_{ticker}"
    cached = cache.get(cache_key, max_age=300)
    if cached is not None:
        return cached
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        price = info.get("regularMarketPrice") or info.get("currentPrice") or 0
        prev_close = info.get("regularMarketPreviousClose") or info.get("previousClose") or 0
        open_p = info.get("regularMarketOpen") or info.get("open") or 0
        high = info.get("regularMarketDayHigh") or info.get("dayHigh") or 0
        low = info.get("regularMarketDayLow") or info.get("dayLow") or 0
        volume = info.get("regularMarketVolume") or info.get("volume") or 0
        change = price - prev_close if prev_close else 0
        change_pct = (change / prev_close * 100) if prev_close else 0
        si_raw = info.get("shortPercentOfFloat", 0) or 0
        result = {
            "ticker": ticker,
            "name": info.get("shortName", info.get("longName", ticker)),
            "sector": info.get("sector", "N/A"),
            "industry": info.get("industry", "N/A"),
            "marketCap": info.get("marketCap", 0),
            "avgVolume": info.get("averageVolume", 0),
            "fiftyTwoWeekHigh": info.get("fiftyTwoWeekHigh", 0),
            "fiftyTwoWeekLow": info.get("fiftyTwoWeekLow", 0),
            "pe": info.get("trailingPE", 0),
            "dividend": info.get("dividendYield", 0),
            "price": _safe_float(price), "open": _safe_float(open_p),
            "high": _safe_float(high), "low": _safe_float(low),
            "close": _safe_float(price), "prevClose": _safe_float(prev_close),
            "volume": _safe_int(volume), "change": round(change, 2),
            "changePct": round(change_pct, 2),
            "beta": _safe_float(info.get("beta", 0)),
            "eps": _safe_float(info.get("trailingEps", 0)),
            "shortPct": _safe_float(si_raw * 100 if si_raw < 1 else si_raw),
            "shortRatio": _safe_float(info.get("shortRatio", 0)),
            "targetPrice": _safe_float(info.get("targetMeanPrice", 0)),
            "recommendation": info.get("recommendationKey", "N/A"),
        }
        cache.set(cache_key, result)
        return result
    except Exception:
        return {"ticker": ticker, "name": ticker, "sector": "N/A", "industry": "N/A",
                "marketCap": 0, "avgVolume": 0, "fiftyTwoWeekHigh": 0, "fiftyTwoWeekLow": 0,
                "pe": 0, "dividend": 0, "price": 0, "open": 0, "high": 0, "low": 0,
                "close": 0, "prevClose": 0, "volume": 0, "change": 0, "changePct": 0,
                "beta": 0, "eps": 0, "shortPct": 0, "shortRatio": 0, "targetPrice": 0,
                "recommendation": "N/A"}


def get_bulk_info(tickers):
    cache_key = "bulk_info"
    cached = cache.get(cache_key, max_age=300)
    if cached is not None:
        known = {t: cached[t] for t in tickers if t in cached}
        missing = [t for t in tickers if t not in cached]
    else:
        known = {}
        missing = list(tickers)
        cached = {}
    if missing:
        with ThreadPoolExecutor(max_workers=10) as pool:
            futures = {pool.submit(get_stock_info, t): t for t in missing}
            for f in as_completed(futures):
                t = futures[f]
                try:
                    known[t] = f.result()
                except Exception:
                    known[t] = {"ticker": t, "name": t, "sector": "N/A", "industry": "N/A",
                                "marketCap": 0, "avgVolume": 0, "fiftyTwoWeekHigh": 0,
                                "fiftyTwoWeekLow": 0, "pe": 0, "dividend": 0}
        cached.update(known)
        cache.set("bulk_info", cached)
    return known


def get_quotes(tickers):
    all_quotes = {}
    for i in range(0, len(tickers), 50):
        batch = tickers[i:i + 50]
        result = _fetch_batch(batch, max_age=15)
        if result:
            all_quotes.update(result)
    return all_quotes


def get_market_overview():
    cached = cache.get("market_overview", max_age=15)
    if cached is not None:
        return cached
    index_tickers = list(INDICES.keys())
    result = {"indices": [], "marketStatus": _get_market_status()}
    try:
        data = yf.download(index_tickers, period="2d", group_by="ticker", progress=False, threads=True)
        for ticker, name in INDICES.items():
            try:
                df = data[ticker] if len(index_tickers) > 1 else data
                if df.empty or len(df) < 1:
                    continue
                current = _safe_float(df.iloc[-1].get("Close"))
                prev = _safe_float(df.iloc[-2].get("Close")) if len(df) > 1 else current
                change = current - prev
                change_pct = (change / prev * 100) if prev != 0 else 0
                result["indices"].append({"ticker": ticker, "name": name,
                    "price": round(current, 2), "change": round(change, 2),
                    "changePct": round(change_pct, 2)})
            except Exception:
                continue
    except Exception:
        pass
    cache.set("market_overview", result)
    return result


def get_sectors():
    cached = cache.get("sectors", max_age=30)
    if cached is not None:
        return cached
    etf_tickers = list(SECTOR_ETFS.keys())
    sectors = []
    try:
        data = yf.download(etf_tickers, period="2d", group_by="ticker", progress=False, threads=True)
        for etf, name in SECTOR_ETFS.items():
            try:
                df = data[etf] if len(etf_tickers) > 1 else data
                if df.empty or len(df) < 1:
                    continue
                current = _safe_float(df.iloc[-1].get("Close"))
                prev = _safe_float(df.iloc[-2].get("Close")) if len(df) > 1 else current
                change_pct = ((current - prev) / prev * 100) if prev != 0 else 0
                sectors.append({"name": name, "etf": etf, "changePct": round(change_pct, 2)})
            except Exception:
                continue
    except Exception:
        pass
    sectors.sort(key=lambda x: x["changePct"], reverse=True)
    cache.set("sectors", sectors)
    return sectors


def get_history(ticker, period="5d"):
    cache_key = f"history_{ticker}_{period}"
    cached = cache.get(cache_key, max_age=60)
    if cached is not None:
        return cached
    try:
        stock = yf.Ticker(ticker)
        df = stock.history(period=period)
        history = [{"date": idx.strftime("%Y-%m-%d %H:%M"),
                     "open": _safe_float(row.get("Open")),
                     "high": _safe_float(row.get("High")),
                     "low": _safe_float(row.get("Low")),
                     "close": _safe_float(row.get("Close")),
                     "volume": _safe_int(row.get("Volume"))}
                    for idx, row in df.iterrows()]
        cache.set(cache_key, history)
        return history
    except Exception:
        return []


def get_most_volatile(limit=20):
    cached = cache.get("most_volatile", max_age=30)
    if cached is not None:
        return cached[:limit]
    quotes = get_quotes(ALL_UNIVERSE)
    info_map = get_bulk_info(ALL_UNIVERSE)
    results = []
    for ticker in ALL_UNIVERSE:
        q = quotes.get(ticker)
        if not q:
            continue
        high, low, close, open_p = q.get("high", 0), q.get("low", 0), q.get("close", 0), q.get("open", 0)
        intraday_range = ((high - low) / close) * 100 if low > 0 and close > 0 else 0
        change_pct = ((close - open_p) / open_p * 100) if open_p else 0
        info = info_map.get(ticker, {})
        results.append({"ticker": ticker, "name": info.get("name", ticker),
            "price": round(close, 2), "changePct": round(change_pct, 2),
            "high": round(high, 2), "low": round(low, 2),
            "range": round(intraday_range, 2), "volume": q.get("volume", 0),
            "sector": info.get("sector", "N/A")})
    results.sort(key=lambda x: abs(x["range"]), reverse=True)
    cache.set("most_volatile", results)
    return results[:limit]


def get_most_active(limit=20):
    cached = cache.get("most_active", max_age=30)
    if cached is not None:
        return cached[:limit]
    quotes = get_quotes(ALL_UNIVERSE)
    info_map = get_bulk_info(ALL_UNIVERSE)
    results = []
    for ticker in ALL_UNIVERSE:
        q = quotes.get(ticker)
        if not q:
            continue
        close, open_p, volume = q.get("close", 0), q.get("open", 0), q.get("volume", 0)
        info = info_map.get(ticker, {})
        avg_vol = info.get("avgVolume", 0)
        change_pct = ((close - open_p) / open_p * 100) if open_p else 0
        results.append({"ticker": ticker, "name": info.get("name", ticker),
            "price": round(close, 2), "changePct": round(change_pct, 2),
            "volume": volume, "avgVolume": avg_vol,
            "dollarVolume": round(close * volume, 0),
            "volRatio": round(volume / avg_vol, 2) if avg_vol else 0,
            "sector": info.get("sector", "N/A")})
    results.sort(key=lambda x: x["dollarVolume"], reverse=True)
    cache.set("most_active", results)
    return results[:limit]


def get_biggest_losers(limit=20):
    cached = cache.get("biggest_losers", max_age=30)
    if cached is not None:
        return cached[:limit]
    quotes = get_quotes(ALL_UNIVERSE)
    info_map = get_bulk_info(ALL_UNIVERSE)
    results = []
    for ticker in ALL_UNIVERSE:
        q = quotes.get(ticker)
        if not q:
            continue
        close, open_p = q.get("close", 0), q.get("open", 0)
        change_pct = ((close - open_p) / open_p * 100) if open_p else 0
        info = info_map.get(ticker, {})
        if change_pct < 0:
            results.append({"ticker": ticker, "name": info.get("name", ticker),
                "price": round(close, 2), "change": round(close - open_p, 2),
                "changePct": round(change_pct, 2), "volume": q.get("volume", 0),
                "marketCap": info.get("marketCap", 0), "sector": info.get("sector", "N/A")})
    results.sort(key=lambda x: x["changePct"])
    cache.set("biggest_losers", results)
    return results[:limit]


def get_after_hours_movers(limit=20):
    cached = cache.get("ah_movers", max_age=60)
    if cached is not None:
        return cached[:limit]
    results = []
    with ThreadPoolExecutor(max_workers=10) as pool:
        futures = {pool.submit(_get_ah_data, t): t for t in ALL_UNIVERSE[:60]}
        for f in as_completed(futures):
            try:
                data = f.result()
                if data and abs(data.get("ahChangePct", 0)) > 0.1:
                    results.append(data)
            except Exception:
                continue
    results.sort(key=lambda x: abs(x["ahChangePct"]), reverse=True)
    cache.set("ah_movers", results)
    return results[:limit]


def _get_ah_data(ticker):
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        regular_price = info.get("regularMarketPrice", 0)
        post_price = info.get("postMarketPrice", 0) or info.get("preMarketPrice", 0)
        if not regular_price or not post_price:
            return None
        ah_change = post_price - regular_price
        ah_change_pct = (ah_change / regular_price * 100) if regular_price else 0
        return {"ticker": ticker, "name": info.get("shortName", ticker),
            "regularPrice": round(regular_price, 2), "extendedPrice": round(post_price, 2),
            "ahChange": round(ah_change, 2), "ahChangePct": round(ah_change_pct, 2),
            "volume": info.get("regularMarketVolume", 0), "sector": info.get("sector", "N/A"),
            "source": "post" if info.get("postMarketPrice") else "pre"}
    except Exception:
        return None


def get_stock_news(ticker, limit=5):
    cache_key = f"news_{ticker}"
    cached = cache.get(cache_key, max_age=600)
    if cached is not None:
        return cached[:limit]
    try:
        stock = yf.Ticker(ticker)
        raw_news = stock.news
        articles = []
        for item in (raw_news or [])[:limit]:
            content = item.get("content", {})
            articles.append({
                "title": content.get("title", item.get("title", "")),
                "publisher": content.get("provider", {}).get("displayName", "")
                             if isinstance(content.get("provider"), dict)
                             else item.get("publisher", ""),
                "link": content.get("canonicalUrl", {}).get("url", "")
                        if isinstance(content.get("canonicalUrl"), dict)
                        else item.get("link", ""),
                "date": content.get("pubDate", item.get("providerPublishTime", "")),
            })
        articles = [a for a in articles if a["title"]]
        cache.set(cache_key, articles)
        return articles[:limit]
    except Exception:
        return []


def get_short_squeeze_candidates(limit=20):
    cached = cache.get("short_squeeze", max_age=120)
    if cached is not None:
        return cached[:limit]
    results = []
    tickers = SHORT_SQUEEZE_CANDIDATES + [t for t in ALL_UNIVERSE if t not in SHORT_SQUEEZE_CANDIDATES][:30]
    with ThreadPoolExecutor(max_workers=10) as pool:
        futures = {pool.submit(_analyze_squeeze, t): t for t in tickers}
        for f in as_completed(futures):
            try:
                data = f.result()
                if data and data.get("squeezeScore", 0) > 0:
                    results.append(data)
            except Exception:
                continue
    results.sort(key=lambda x: x["squeezeScore"], reverse=True)
    top_tickers = [r["ticker"] for r in results[:10]]
    with ThreadPoolExecutor(max_workers=5) as pool:
        nf = {pool.submit(get_stock_news, t, 3): t for t in top_tickers}
        nm = {}
        for f in as_completed(nf):
            try:
                nm[nf[f]] = f.result()
            except Exception:
                nm[nf[f]] = []
    for r in results:
        r["news"] = nm.get(r["ticker"], [])
    cache.set("short_squeeze", results)
    return results[:limit]


def _analyze_squeeze(ticker):
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        short_pct = info.get("shortPercentOfFloat", 0) or 0
        short_ratio = info.get("shortRatio", 0) or 0
        float_shares = info.get("floatShares", 0) or 0
        avg_volume = info.get("averageVolume", 0) or 0
        current_price = info.get("regularMarketPrice") or info.get("currentPrice") or 0
        volume = info.get("regularMarketVolume", 0) or 0
        prev_close = info.get("regularMarketPreviousClose") or info.get("previousClose") or 0
        change_pct = ((current_price - prev_close) / prev_close * 100) if prev_close else 0
        vol_ratio = (volume / avg_volume) if avg_volume else 0
        si = short_pct * 100 if short_pct < 1 else short_pct
        score, signals = 0, []
        if si > 20:    score += 35; signals.append(f"Very high SI: {si:.1f}%")
        elif si > 10:  score += 20; signals.append(f"High SI: {si:.1f}%")
        elif si > 5:   score += 8;  signals.append(f"Moderate SI: {si:.1f}%")
        if short_ratio > 5:   score += 25; signals.append(f"Days to cover: {short_ratio:.1f}")
        elif short_ratio > 3: score += 15; signals.append(f"Days to cover: {short_ratio:.1f}")
        elif short_ratio > 1.5: score += 5; signals.append(f"Days to cover: {short_ratio:.1f}")
        if vol_ratio > 3:   score += 20; signals.append(f"Volume surge: {vol_ratio:.1f}x avg")
        elif vol_ratio > 1.5: score += 10; signals.append(f"Above avg vol: {vol_ratio:.1f}x")
        if change_pct > 5:   score += 15; signals.append(f"Momentum: +{change_pct:.1f}%")
        elif change_pct > 2: score += 8;  signals.append(f"Rising: +{change_pct:.1f}%")
        if float_shares and float_shares < 50_000_000:
            score += 10; signals.append(f"Low float: {float_shares/1e6:.1f}M")
        if score == 0:
            return None
        risk = "EXTREME" if score >= 60 else "HIGH" if score >= 40 else "MODERATE" if score >= 20 else "LOW"
        thesis = _build_squeeze_thesis(ticker, info.get("shortName", ticker), si, short_ratio,
                                        float_shares, vol_ratio, change_pct, score)
        return {"ticker": ticker, "name": info.get("shortName", ticker),
            "price": round(current_price, 2), "changePct": round(change_pct, 2),
            "shortPct": round(si, 2), "shortRatio": round(short_ratio, 2),
            "floatShares": float_shares, "volume": volume, "avgVolume": avg_volume,
            "volRatio": round(vol_ratio, 2), "squeezeScore": score, "risk": risk,
            "signals": signals, "sector": info.get("sector", "N/A"), "thesis": thesis}
    except Exception:
        return None


def _build_squeeze_thesis(ticker, name, si, dtc, float_shares, vol_ratio, change_pct, score):
    parts = []
    name = name or ticker
    if si > 20:
        parts.append(f"{name} has {si:.1f}% of its float sold short — roughly 1 in {int(100/si)} tradable shares is a borrowed bet against the stock. That's an enormous bearish position that creates forced buying pressure if the price moves against shorts.")
    elif si > 10:
        parts.append(f"{name} has {si:.1f}% short interest, well above the 5% threshold where squeeze mechanics become meaningful.")
    elif si > 5:
        parts.append(f"{name} has {si:.1f}% short interest — moderate, but enough to create upward pressure if other catalysts align.")
    if dtc > 5:
        parts.append(f"At current volume, it would take shorts {dtc:.1f} days to fully cover their positions. That's a long exit queue — if the price starts rising, late shorts can't escape quickly, amplifying buying pressure.")
    elif dtc > 3:
        parts.append(f"Days-to-cover is {dtc:.1f} — shorts need multiple sessions to unwind, creating a bottleneck if the price spikes.")
    elif dtc > 1.5:
        parts.append(f"Days to cover is {dtc:.1f} — manageable normally, but a volume spike would compress that timeline.")
    if float_shares and float_shares < 20_000_000:
        parts.append(f"Very low float of {float_shares/1e6:.1f}M shares — even modest buying demand moves the price dramatically, and short covering into a thin order book creates explosive moves.")
    elif float_shares and float_shares < 50_000_000:
        parts.append(f"Float of {float_shares/1e6:.1f}M shares is relatively tight. Short covering actively depletes available shares, pushing price higher per unit of demand.")
    if vol_ratio > 3:
        parts.append(f"Today's volume is {vol_ratio:.1f}x average — a major surge. Volume spikes + high short interest is the classic squeeze trigger: new buyers flood in, shares dry up, shorts are forced to cover at rising prices.")
    elif vol_ratio > 1.5:
        parts.append(f"Volume at {vol_ratio:.1f}x average shows heightened interest. If this continues, shorts may be forced to start covering.")
    if change_pct > 5:
        parts.append(f"Already up {change_pct:.1f}% today — shorts are losing money. As losses mount, brokers issue margin calls forcing shorts to buy back regardless of price. This creates a feedback loop: covering → higher price → more margin calls → more covering.")
    elif change_pct > 2:
        parts.append(f"Up {change_pct:.1f}% today, putting pressure on short positions. Continued momentum could trigger the first wave of forced covering.")
    if score >= 60:
        parts.append("BOTTOM LINE: Multiple squeeze factors are converging. If buying pressure continues, shorts face a classic trap where covering accelerates the very move they're betting against.")
    elif score >= 40:
        parts.append("SETUP: Several squeeze ingredients present. A catalyst — earnings, news, or social media — could spark forced covering.")
    elif score >= 20:
        parts.append("WATCH: Setup developing but not fully loaded. Monitor for increasing volume and tightening conditions.")
    return " ".join(parts)


def _get_market_status():
    now = datetime.now(timezone.utc)
    hour_et = (now.hour - 4) % 24
    weekday = now.weekday()
    if weekday >= 5:
        return "CLOSED"
    if 4 <= hour_et < 9:
        return "PRE-MARKET"
    if 9 <= hour_et < 10:
        if hour_et == 9 and now.minute < 30:
            return "PRE-MARKET"
        return "OPEN"
    if 10 <= hour_et < 16:
        return "OPEN"
    if 16 <= hour_et < 20:
        return "AFTER-HOURS"
    return "CLOSED"
