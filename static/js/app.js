const App = {
    currentTab: "screener",
    refreshInterval: null,

    init() {
        this.bindEvents();
        this.loadMarketOverview();
        this.loadSectors();
        Watchlist.init();
        Alerts.init();
        Screener.load();
        this.refreshInterval = setInterval(() => this.refresh(), 30000);
    },

    bindEvents() {
        document.querySelectorAll(".tab-btn").forEach(btn => {
            btn.addEventListener("click", () => this.switchTab(btn.dataset.tab));
        });
        document.addEventListener("keydown", e => {
            if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA") return;
            switch (e.key) {
                case "/": e.preventDefault(); this.openSearch(); break;
                case "w": case "W": this.promptAddWatchlist(); break;
                case "a": case "A": Alerts.openModal(); break;
                case "r": case "R": this.refresh(); break;
                case "Escape": this.closeSearch(); this.closeDetail(); Alerts.closeModal(); break;
                case "1": this.switchTab("screener"); break;
                case "2": this.switchTab("volatile"); break;
                case "3": this.switchTab("active"); break;
                case "4": this.switchTab("losers"); break;
                case "5": this.switchTab("afterhours"); break;
                case "6": this.switchTab("squeeze"); break;
                case "7": this.switchTab("learn"); break;
            }
        });
    },

    switchTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
        document.querySelectorAll(".tab-panel").forEach(p => p.classList.toggle("active", p.id === "tab-" + tab));
        switch (tab) {
            case "screener": Screener.load(Screener.getFilters()); break;
            case "volatile": Panels.loadVolatile(); break;
            case "active": Panels.loadActive(); break;
            case "losers": Panels.loadLosers(); break;
            case "afterhours": Panels.loadAfterHours(); break;
            case "squeeze": Panels.loadSqueeze(); break;
            case "learn": Panels.loadLearn(); break;
        }
    },

    async loadMarketOverview() {
        try {
            const res = await fetch("/api/market-overview");
            const data = await res.json();
            const bar = document.getElementById("indices-bar");
            if (!bar) return;
            let html = "";
            if (data.indices) {
                data.indices.forEach(idx => {
                    const cls = (idx.change || 0) >= 0 ? "green" : "red";
                    const arrow = (idx.change || 0) >= 0 ? "▲" : "▼";
                    html += `<div class="idx-item">
                        <span class="idx-name">${idx.name}</span>
                        <span class="idx-price">${(idx.price || 0).toFixed(2)}</span>
                        <span class="idx-change ${cls}">${arrow} ${Math.abs(idx.changePct || 0).toFixed(2)}%</span>
                    </div>`;
                });
            }
            if (data.vix) {
                const vixLevel = data.vix > 30 ? "high" : data.vix > 20 ? "med" : "low";
                html += `<div class="idx-item vix">
                    <span class="idx-name">VIX</span>
                    <span class="idx-price vix-${vixLevel}">${data.vix.toFixed(2)}</span>
                </div>`;
            }
            const statusCls = data.status === "OPEN" ? "open" : "closed";
            html += `<div class="idx-item market-status">
                <span class="status-dot ${statusCls}"></span>
                <span class="status-text">${data.status || "UNKNOWN"}</span>
            </div>`;
            bar.innerHTML = html;
        } catch (e) { console.error("Market overview error:", e); }
    },

    async loadSectors() {
        try {
            const res = await fetch("/api/sectors");
            const data = await res.json();
            const bar = document.getElementById("sector-bar");
            if (!bar || !Array.isArray(data)) return;
            bar.innerHTML = data.map(s => {
                const chg = s.changePct || s.change || 0;
                const cls = chg >= 0 ? "green" : "red";
                return `<div class="sector-item ${cls}" onclick="App.filterBySector('${s.name}')">
                    <span class="sec-name">${s.name}</span>
                    <span class="sec-change">${chg >= 0 ? "+" : ""}${chg.toFixed(2)}%</span>
                </div>`;
            }).join("");
        } catch (e) { console.error("Sectors error:", e); }
    },

    filterBySector(sector) {
        this.switchTab("screener");
        setTimeout(() => {
            const sel = document.getElementById("f-sector");
            if (sel) { sel.value = sector; Screener.load(Screener.getFilters()); }
        }, 100);
    },

    async showDetail(ticker) {
        const panel = document.getElementById("detail-panel");
        const body = document.getElementById("detail-body");
        panel.classList.add("show");
        body.innerHTML = '<div class="loading">LOADING...</div>';
        try {
            const res = await fetch(`/api/quote/${ticker}`);
            const q = await res.json();
            const price = q.price || q.close || 0;
            const change = q.change || 0;
            const changePct = q.changePct || 0;
            const cls = change >= 0 ? "green" : "red";
            const arrow = change >= 0 ? "▲" : "▼";
            const wlBtn = Watchlist.has(ticker)
                ? `<button class="d-wl-btn active" onclick="App.toggleWatchlist('${ticker}')">★ REMOVE</button>`
                : `<button class="d-wl-btn" onclick="App.toggleWatchlist('${ticker}')">☆ WATCH</button>`;

            let html = `<div class="d-header">
                <div class="d-ticker">${ticker}</div>
                <div class="d-name">${q.name || ticker}</div>
                ${wlBtn}
            </div>
            <div class="d-price-block">
                <span class="d-price ${cls}">$${price.toFixed(2)}</span>
                <span class="d-change ${cls}">${arrow} ${Math.abs(change).toFixed(2)} (${Math.abs(changePct).toFixed(2)}%)</span>
            </div>`;

            if (q.open || q.high || q.low) {
                html += `<div class="d-ohlc">
                    <div class="d-ohlc-item"><span>O</span><span>${(q.open || 0).toFixed(2)}</span></div>
                    <div class="d-ohlc-item"><span>H</span><span class="green">${(q.high || 0).toFixed(2)}</span></div>
                    <div class="d-ohlc-item"><span>L</span><span class="red">${(q.low || 0).toFixed(2)}</span></div>
                    <div class="d-ohlc-item"><span>C</span><span>${price.toFixed(2)}</span></div>
                </div>`;
            }

            html += `<div class="d-grid-2">
                <div class="d-kpi"><span class="d-kpi-label">VOLUME</span><span class="d-kpi-value">${Screener.formatVolume(q.volume)}</span></div>
                <div class="d-kpi"><span class="d-kpi-label">AVG VOL</span><span class="d-kpi-value">${Screener.formatVolume(q.avgVolume)}</span></div>
            </div>`;

            html += `<div class="d-section-title">FUNDAMENTALS</div>
            <div class="d-grid-3">
                <div class="d-stat"><span>MKT CAP</span><span>${Screener.formatMarketCap(q.marketCap)}</span></div>
                <div class="d-stat"><span>P/E</span><span>${q.pe ? q.pe.toFixed(1) : "—"}</span></div>
                <div class="d-stat"><span>EPS</span><span>${q.eps ? "$" + q.eps.toFixed(2) : "—"}</span></div>
                <div class="d-stat"><span>BETA</span><span>${q.beta ? q.beta.toFixed(2) : "—"}</span></div>
                <div class="d-stat"><span>DIV YIELD</span><span>${q.dividendYield ? (q.dividendYield * 100).toFixed(2) + "%" : "—"}</span></div>
                <div class="d-stat"><span>SECTOR</span><span>${q.sector || "—"}</span></div>
            </div>`;

            if (q.fiftyTwoWeekLow && q.fiftyTwoWeekHigh) {
                const range52 = q.fiftyTwoWeekHigh - q.fiftyTwoWeekLow;
                const pos = range52 > 0 ? ((price - q.fiftyTwoWeekLow) / range52) * 100 : 50;
                html += `<div class="d-section-title">52-WEEK RANGE</div>
                <div class="d-range-bar">
                    <span class="d-range-low">$${q.fiftyTwoWeekLow.toFixed(2)}</span>
                    <div class="d-range-track"><div class="d-range-fill" style="width:${pos}%"></div></div>
                    <span class="d-range-high">$${q.fiftyTwoWeekHigh.toFixed(2)}</span>
                </div>`;
            }

            if (q.shortPct || q.shortRatio) {
                html += `<div class="d-section-title">SHORT INTEREST</div>
                <div class="d-grid-2">
                    <div class="d-stat"><span>SI %</span><span class="${(q.shortPct||0) > 15 ? 'red' : ''}">${q.shortPct ? q.shortPct.toFixed(1) + "%" : "—"}</span></div>
                    <div class="d-stat"><span>DAYS TO COVER</span><span>${q.shortRatio ? q.shortRatio.toFixed(1) : "—"}</span></div>
                </div>`;
            }

            if (q.targetPrice) {
                const upside = ((q.targetPrice - price) / price * 100).toFixed(1);
                html += `<div class="d-section-title">ANALYST TARGET</div>
                <div class="d-grid-2">
                    <div class="d-stat"><span>TARGET</span><span>$${q.targetPrice.toFixed(2)}</span></div>
                    <div class="d-stat"><span>UPSIDE</span><span class="${upside > 0 ? 'green' : 'red'}">${upside > 0 ? '+' : ''}${upside}%</span></div>
                </div>`;
            }

            html += `<div class="d-section-title">CHART (1M)</div>
            <canvas id="detail-chart" class="d-chart"></canvas>`;

            body.innerHTML = html;

            const chart = document.getElementById("detail-chart");
            if (chart) {
                const histRes = await fetch(`/api/history/${ticker}?period=1mo`);
                const hist = await histRes.json();
                if (hist && hist.length) Charts.drawLineChart(chart, hist);
            }
        } catch (e) {
            body.innerHTML = '<div class="loading error">FAILED TO LOAD</div>';
        }
    },

    toggleWatchlist(ticker) {
        if (Watchlist.has(ticker)) { Watchlist.remove(ticker); } else { Watchlist.add(ticker); }
        this.showDetail(ticker);
    },

    closeDetail() {
        document.getElementById("detail-panel").classList.remove("show");
    },

    openSearch() {
        const overlay = document.getElementById("search-overlay");
        overlay.classList.add("show");
        const input = document.getElementById("search-input");
        input.value = "";
        input.focus();
    },

    closeSearch() {
        document.getElementById("search-overlay").classList.remove("show");
    },

    async doSearch() {
        const q = document.getElementById("search-input").value.trim();
        const results = document.getElementById("search-results");
        if (!q) { results.innerHTML = ""; return; }
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
            const tickers = await res.json();
            results.innerHTML = tickers.map(t =>
                `<div class="search-item" onclick="App.closeSearch();App.showDetail('${t}')">${t}</div>`
            ).join("");
            if (!tickers.length) results.innerHTML = '<div class="search-item">No results</div>';
        } catch (e) { results.innerHTML = '<div class="search-item">Error searching</div>'; }
    },

    promptAddWatchlist() {
        const ticker = prompt("Add ticker to watchlist:");
        if (ticker) Watchlist.add(ticker.trim());
    },

    refresh() {
        this.loadMarketOverview();
        this.loadSectors();
        Watchlist.loadQuotes();
        if (this.currentTab === "screener") Screener.load(Screener.getFilters());
        else this.switchTab(this.currentTab);
        document.getElementById("last-update").textContent = "Updated: " + new Date().toLocaleTimeString();
    }
};

document.addEventListener("DOMContentLoaded", () => App.init());
