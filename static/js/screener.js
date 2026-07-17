const Screener = {
    sortCol: "volume",
    sortDir: "desc",
    data: [],

    async load(filters = {}) {
        const params = new URLSearchParams();
        if (filters.min_volume) params.set("min_volume", filters.min_volume);
        if (filters.sector) params.set("sector", filters.sector);
        if (filters.min_price) params.set("min_price", filters.min_price);
        if (filters.max_price) params.set("max_price", filters.max_price);
        params.set("sort", this.sortCol);
        params.set("order", this.sortDir);

        const panel = document.getElementById("tab-screener");
        panel.innerHTML = '<div class="loading">LOADING SCREENER DATA...</div>';
        try {
            const res = await fetch(`/api/screener?${params}`);
            this.data = await res.json();
            this.render();
        } catch (e) {
            panel.innerHTML = '<div class="loading error">FAILED TO LOAD DATA</div>';
        }
    },

    sort(col) {
        if (this.sortCol === col) {
            this.sortDir = this.sortDir === "desc" ? "asc" : "desc";
        } else {
            this.sortCol = col;
            this.sortDir = "desc";
        }
        this.load(this.getFilters());
    },

    render() {
        const panel = document.getElementById("tab-screener");
        const arrow = this.sortDir === "desc" ? "▼" : "▲";
        const th = (label, col) => {
            const active = this.sortCol === col ? ` class="sort-active"` : "";
            return `<th${active} onclick="Screener.sort('${col}')">${label} ${this.sortCol === col ? arrow : ""}</th>`;
        };
        let html = `<div class="screener-filters">
            <input type="number" id="f-min-vol" placeholder="Min Volume" value="">
            <select id="f-sector"><option value="all">All Sectors</option>
                <option>Technology</option><option>Healthcare</option><option>Financial Services</option>
                <option>Consumer Cyclical</option><option>Communication Services</option>
                <option>Industrials</option><option>Consumer Defensive</option><option>Energy</option>
                <option>Utilities</option><option>Real Estate</option><option>Basic Materials</option></select>
            <input type="number" id="f-min-price" placeholder="Min $" value="">
            <input type="number" id="f-max-price" placeholder="Max $" value="">
            <button onclick="Screener.load(Screener.getFilters())">SCAN</button>
            <button onclick="Screener.resetFilters()">RESET</button>
        </div>
        <table class="stock-table"><thead><tr>
            ${th("TICKER","ticker")}${th("NAME","name")}${th("PRICE","price")}
            ${th("CHG%","change")}${th("VOLUME","volume")}${th("VOL RATIO","volRatio")}
            ${th("MKT CAP","marketCap")}${th("SECTOR","ticker")}
        </tr></thead><tbody>`;
        this.data.forEach(s => {
            const cls = s.changePct >= 0 ? "green" : "red";
            html += `<tr onclick="App.showDetail('${s.ticker}')">
                <td class="ticker">${s.ticker}</td>
                <td class="name">${this.truncate(s.name, 20)}</td>
                <td>$${s.price.toFixed(2)}</td>
                <td class="${cls}">${s.changePct >= 0 ? "+" : ""}${s.changePct.toFixed(2)}%</td>
                <td>${this.formatVolume(s.volume)}</td>
                <td>${s.volRatio.toFixed(1)}x</td>
                <td>${this.formatMarketCap(s.marketCap)}</td>
                <td class="sector-cell">${s.sector}</td>
            </tr>`;
        });
        html += "</tbody></table>";
        if (!this.data.length) html += '<div class="loading">NO RESULTS FOUND</div>';
        panel.innerHTML = html;
    },

    getFilters() {
        return {
            min_volume: document.getElementById("f-min-vol")?.value || "",
            sector: document.getElementById("f-sector")?.value || "all",
            min_price: document.getElementById("f-min-price")?.value || "",
            max_price: document.getElementById("f-max-price")?.value || "",
        };
    },

    resetFilters() {
        const ids = ["f-min-vol", "f-min-price", "f-max-price"];
        ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
        const sel = document.getElementById("f-sector");
        if (sel) sel.value = "all";
        this.load();
    },

    formatVolume(v) {
        if (!v) return "—";
        if (v >= 1e9) return (v / 1e9).toFixed(1) + "B";
        if (v >= 1e6) return (v / 1e6).toFixed(1) + "M";
        if (v >= 1e3) return (v / 1e3).toFixed(0) + "K";
        return v.toString();
    },

    formatMarketCap(v) {
        if (!v) return "—";
        if (v >= 1e12) return "$" + (v / 1e12).toFixed(1) + "T";
        if (v >= 1e9) return "$" + (v / 1e9).toFixed(1) + "B";
        if (v >= 1e6) return "$" + (v / 1e6).toFixed(0) + "M";
        return "$" + v;
    },

    truncate(str, len) {
        return str && str.length > len ? str.slice(0, len) + "…" : (str || "");
    }
};
