const Watchlist = {
    KEY: "tt_watchlist",
    defaults: ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "JPM"],
    data: {},

    init() {
        const saved = localStorage.getItem(this.KEY);
        this.tickers = saved ? JSON.parse(saved) : [...this.defaults];
        this.loadQuotes();
    },

    save() { localStorage.setItem(this.KEY, JSON.stringify(this.tickers)); },

    add(ticker) {
        ticker = ticker.toUpperCase();
        if (!this.tickers.includes(ticker)) {
            this.tickers.push(ticker);
            this.save();
            this.loadQuotes();
        }
    },

    remove(ticker) {
        this.tickers = this.tickers.filter(t => t !== ticker);
        this.save();
        this.render();
    },

    has(ticker) { return this.tickers.includes(ticker.toUpperCase()); },

    clear() {
        this.tickers = [];
        this.save();
        this.render();
    },

    async loadQuotes() {
        if (!this.tickers.length) { this.render(); return; }
        try {
            const res = await fetch(`/api/watchlist/quotes?tickers=${this.tickers.join(",")}`);
            this.data = await res.json();
        } catch (e) { console.error("Watchlist fetch error:", e); }
        this.render();
    },

    render() {
        const list = document.getElementById("watchlist-items");
        if (!list) return;
        if (!this.tickers.length) {
            list.innerHTML = '<div class="wl-empty">Press W or click + to add stocks</div>';
            return;
        }
        list.innerHTML = this.tickers.map(t => {
            const q = this.data[t] || {};
            const price = q.close || q.price || 0;
            const change = q.change || 0;
            const changePct = q.changePct || 0;
            const color = change >= 0 ? "var(--green)" : "var(--red)";
            const arrow = change >= 0 ? "▲" : "▼";
            return `<div class="wl-item" onclick="App.showDetail('${t}')">
                <div class="wl-row">
                    <span class="wl-ticker">${t}</span>
                    <span class="wl-price" style="color:${color}">$${price.toFixed(2)}</span>
                </div>
                <div class="wl-row">
                    <canvas class="wl-spark" id="spark-${t}" width="60" height="20"></canvas>
                    <span class="wl-change" style="color:${color}">${arrow} ${Math.abs(changePct).toFixed(2)}%</span>
                </div>
                <button class="wl-remove" onclick="event.stopPropagation();Watchlist.remove('${t}')" title="Remove">×</button>
            </div>`;
        }).join("");

        this.tickers.forEach(t => {
            const canvas = document.getElementById(`spark-${t}`);
            if (canvas) {
                fetch(`/api/history/${t}?period=5d`)
                    .then(r => r.json())
                    .then(hist => {
                        if (hist && hist.length) {
                            const prices = hist.map(h => h.close);
                            const color = prices[prices.length-1] >= prices[0] ? "#00c853" : "#ff1744";
                            Charts.drawSparkline(canvas, prices, color);
                        }
                    }).catch(() => {});
            }
        });
    }
};
