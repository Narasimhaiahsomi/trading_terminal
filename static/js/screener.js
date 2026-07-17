const Screener = {
    KEY: "tt_presets",
    sortCol: "volume",
    sortDir: "desc",
    data: [],
    activePreset: null,

    defaultPresets: [
        { id: "bluechip", name: "Blue Chip", icon: "💎", filters: { min_volume: "1000000", sector: "all", min_price: "50", max_price: "", sort: "volume" }, desc: "High-volume large-cap stocks" },
        { id: "daytrade", name: "Day Trade", icon: "⚡", filters: { min_volume: "5000000", sector: "all", min_price: "5", max_price: "500", sort: "volume" }, desc: "High liquidity for quick entries/exits" },
        { id: "tech", name: "Tech Only", icon: "🖥", filters: { min_volume: "500000", sector: "Technology", min_price: "", max_price: "", sort: "volume" }, desc: "Technology sector stocks" },
        { id: "penny", name: "Under $10", icon: "🪙", filters: { min_volume: "1000000", sector: "all", min_price: "1", max_price: "10", sort: "volume" }, desc: "Low-price high-volume movers" },
        { id: "megacap", name: "Mega Cap", icon: "🏛", filters: { min_volume: "", sector: "all", min_price: "100", max_price: "", sort: "marketCap" }, desc: "$100+ large companies" },
        { id: "energy", name: "Energy", icon: "🛢", filters: { min_volume: "500000", sector: "Energy", min_price: "", max_price: "", sort: "volume" }, desc: "Oil, gas & energy sector" },
        { id: "finance", name: "Finance", icon: "🏦", filters: { min_volume: "500000", sector: "Financial Services", min_price: "", max_price: "", sort: "volume" }, desc: "Banks & financial services" },
        { id: "health", name: "Healthcare", icon: "🏥", filters: { min_volume: "500000", sector: "Healthcare", min_price: "", max_price: "", sort: "volume" }, desc: "Pharma, biotech & healthcare" },
    ],

    init() {
        const saved = localStorage.getItem(this.KEY);
        this.customPresets = saved ? JSON.parse(saved) : [];
    },

    savePresets() {
        localStorage.setItem(this.KEY, JSON.stringify(this.customPresets));
    },

    getAllPresets() {
        return [...this.defaultPresets, ...this.customPresets];
    },

    async load(filters = {}) {
        if (!this.customPresets) this.init();
        const params = new URLSearchParams();
        if (filters.min_volume) params.set("min_volume", filters.min_volume);
        if (filters.sector && filters.sector !== "all") params.set("sector", filters.sector);
        if (filters.min_price) params.set("min_price", filters.min_price);
        if (filters.max_price) params.set("max_price", filters.max_price);
        params.set("sort", filters.sort || this.sortCol);
        params.set("order", this.sortDir);

        const panel = document.getElementById("tab-screener");
        panel.innerHTML = '<div class="loading">LOADING SCREENER DATA...</div>';
        try {
            const res = await fetch(`/api/screener?${params}`);
            this.data = await res.json();
            this.render(filters);
        } catch (e) {
            panel.innerHTML = '<div class="loading error">FAILED TO LOAD DATA</div>';
        }
    },

    applyPreset(id) {
        const preset = this.getAllPresets().find(p => p.id === id);
        if (!preset) return;
        this.activePreset = id;
        this.sortCol = preset.filters.sort || "volume";
        this.sortDir = "desc";
        this.load(preset.filters);
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

    render(activeFilters = {}) {
        const panel = document.getElementById("tab-screener");
        const allPresets = this.getAllPresets();
        const arrow = this.sortDir === "desc" ? "▼" : "▲";
        const th = (label, col) => {
            const active = this.sortCol === col ? ` class="sort-active"` : "";
            return `<th${active} onclick="Screener.sort('${col}')">${label} ${this.sortCol === col ? arrow : ""}</th>`;
        };

        let html = `<div class="preset-bar">
            <div class="preset-list">`;
        allPresets.forEach(p => {
            const isActive = this.activePreset === p.id;
            const isCustom = this.customPresets.some(c => c.id === p.id);
            html += `<button class="preset-btn ${isActive ? 'active' : ''}" onclick="Screener.applyPreset('${p.id}')" title="${p.desc}">
                <span class="preset-icon">${p.icon}</span>
                <span class="preset-name">${p.name}</span>
                ${isCustom ? `<span class="preset-del" onclick="event.stopPropagation();Screener.deletePreset('${p.id}')">×</span>` : ''}
            </button>`;
        });
        html += `<button class="preset-btn preset-add" onclick="Screener.openSaveModal()" title="Save current filters as preset">
                <span class="preset-icon">+</span>
                <span class="preset-name">SAVE</span>
            </button>
            </div>
        </div>`;

        const fv = (key) => activeFilters[key] || "";
        html += `<div class="screener-filters">
            <input type="number" id="f-min-vol" placeholder="Min Volume" value="${fv('min_volume')}">
            <select id="f-sector"><option value="all">All Sectors</option>
                <option ${fv('sector')==='Technology'?'selected':''}>Technology</option>
                <option ${fv('sector')==='Healthcare'?'selected':''}>Healthcare</option>
                <option ${fv('sector')==='Financial Services'?'selected':''}>Financial Services</option>
                <option ${fv('sector')==='Consumer Cyclical'?'selected':''}>Consumer Cyclical</option>
                <option ${fv('sector')==='Communication Services'?'selected':''}>Communication Services</option>
                <option ${fv('sector')==='Industrials'?'selected':''}>Industrials</option>
                <option ${fv('sector')==='Consumer Defensive'?'selected':''}>Consumer Defensive</option>
                <option ${fv('sector')==='Energy'?'selected':''}>Energy</option>
                <option ${fv('sector')==='Utilities'?'selected':''}>Utilities</option>
                <option ${fv('sector')==='Real Estate'?'selected':''}>Real Estate</option>
                <option ${fv('sector')==='Basic Materials'?'selected':''}>Basic Materials</option></select>
            <input type="number" id="f-min-price" placeholder="Min $" value="${fv('min_price')}">
            <input type="number" id="f-max-price" placeholder="Max $" value="${fv('max_price')}">
            <button onclick="Screener.activePreset=null;Screener.load(Screener.getFilters())">SCAN</button>
            <button onclick="Screener.resetFilters()">RESET</button>
        </div>
        <div class="screener-count">${this.data.length} stocks found</div>
        <table class="stock-table"><thead><tr>
            ${th("TICKER","ticker")}${th("NAME","name")}${th("PRICE","price")}
            ${th("CHG","change")}${th("CHG%","change")}${th("VOLUME","volume")}${th("VOL RATIO","volRatio")}
            ${th("MKT CAP","marketCap")}${th("SECTOR","ticker")}
        </tr></thead><tbody>`;
        this.data.forEach(s => {
            const cls = s.changePct >= 0 ? "green" : "red";
            html += `<tr onclick="App.showDetail('${s.ticker}')">
                <td class="ticker">${s.ticker}</td>
                <td class="name">${this.truncate(s.name, 20)}</td>
                <td>$${s.price.toFixed(2)}</td>
                <td class="${cls}">${s.change >= 0 ? "+$" : "-$"}${Math.abs(s.change).toFixed(2)}</td>
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

    openSaveModal() {
        const filters = this.getFilters();
        const name = prompt("Preset name:");
        if (!name) return;
        const icon = prompt("Pick an emoji icon (or press enter for default):", "📌") || "📌";
        const id = "custom_" + Date.now();
        this.customPresets.push({
            id, name, icon,
            filters: { ...filters, sort: this.sortCol },
            desc: "Custom: " + name
        });
        this.savePresets();
        this.activePreset = id;
        this.render(filters);
    },

    deletePreset(id) {
        this.customPresets = this.customPresets.filter(p => p.id !== id);
        this.savePresets();
        if (this.activePreset === id) this.activePreset = null;
        this.render(this.getFilters());
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
        this.activePreset = null;
        this.sortCol = "volume";
        this.sortDir = "desc";
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
