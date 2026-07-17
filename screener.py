from data_sources import ALL_UNIVERSE, get_quotes, get_bulk_info


def run_screener(min_volume=0, max_volume=None, sector=None, min_price=0,
                 max_price=None, min_change=None, max_change=None,
                 min_market_cap=0, sort_by="volume", sort_order="desc",
                 universe=None):
    tickers = universe or ALL_UNIVERSE
    info_map = get_bulk_info(tickers)
    quotes = get_quotes(tickers)
    results = []
    for ticker in tickers:
        info = info_map.get(ticker, {})
        quote = quotes.get(ticker)
        if not quote:
            continue
        close = quote.get("close", 0)
        open_price = quote.get("open", 0)
        volume = quote.get("volume", 0)
        market_cap = info.get("marketCap", 0)
        avg_volume = info.get("avgVolume", 0)
        sector_name = info.get("sector", "N/A")
        change = close - open_price if open_price else 0
        change_pct = (change / open_price) * 100 if open_price else 0
        if volume < min_volume: continue
        if max_volume and volume > max_volume: continue
        if sector and sector.lower() != "all" and sector.lower() != sector_name.lower(): continue
        if close < min_price: continue
        if max_price and close > max_price: continue
        if min_change is not None and change_pct < min_change: continue
        if max_change is not None and change_pct > max_change: continue
        if market_cap < min_market_cap: continue
        vol_ratio = (volume / avg_volume) if avg_volume > 0 else 0
        results.append({
            "ticker": ticker, "name": info.get("name", ticker),
            "price": round(close, 2), "open": round(open_price, 2),
            "high": round(quote.get("high", 0), 2), "low": round(quote.get("low", 0), 2),
            "change": round(change, 2), "changePct": round(change_pct, 2),
            "volume": volume, "avgVolume": avg_volume, "volRatio": round(vol_ratio, 2),
            "marketCap": market_cap, "sector": sector_name,
            "industry": info.get("industry", "N/A"),
            "fiftyTwoWeekHigh": info.get("fiftyTwoWeekHigh", 0),
            "fiftyTwoWeekLow": info.get("fiftyTwoWeekLow", 0),
            "pe": info.get("pe", 0),
        })
    sort_key = {"volume": lambda x: x["volume"], "change": lambda x: x["changePct"],
                "price": lambda x: x["price"], "marketCap": lambda x: x["marketCap"],
                "name": lambda x: x["name"], "ticker": lambda x: x["ticker"],
                "volRatio": lambda x: x["volRatio"]}.get(sort_by, lambda x: x["volume"])
    results.sort(key=sort_key, reverse=sort_order.lower() != "asc")
    return results
