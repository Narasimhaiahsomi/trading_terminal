const Alerts = {
    KEY: "tt_alerts",
    alerts: [],
    interval: null,

    init() {
        const saved = localStorage.getItem(this.KEY);
        this.alerts = saved ? JSON.parse(saved) : [];
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
        this.startChecking();
    },

    save() { localStorage.setItem(this.KEY, JSON.stringify(this.alerts)); },

    add(ticker, condition, value) {
        this.alerts.push({
            id: Date.now(), ticker: ticker.toUpperCase(),
            condition, value: parseFloat(value), triggered: false,
            created: new Date().toISOString()
        });
        this.save();
    },

    remove(id) {
        this.alerts = this.alerts.filter(a => a.id !== id);
        this.save();
    },

    startChecking() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => this.checkAlerts(), 15000);
    },

    async checkAlerts() {
        const active = this.alerts.filter(a => !a.triggered);
        if (!active.length) return;
        const tickers = [...new Set(active.map(a => a.ticker))];
        try {
            const res = await fetch(`/api/watchlist/quotes?tickers=${tickers.join(",")}`);
            const quotes = await res.json();
            active.forEach(alert => {
                const q = quotes[alert.ticker];
                if (!q) return;
                const price = q.close || q.price || 0;
                const changePct = q.changePct || 0;
                const volume = q.volume || 0;
                let triggered = false;
                switch (alert.condition) {
                    case "above": triggered = price >= alert.value; break;
                    case "below": triggered = price <= alert.value; break;
                    case "pct_up": triggered = changePct >= alert.value; break;
                    case "pct_down": triggered = changePct <= -alert.value; break;
                    case "vol_above": triggered = volume >= alert.value; break;
                }
                if (triggered) {
                    alert.triggered = true;
                    this.save();
                    this.notify(alert, price);
                }
            });
        } catch (e) { console.error("Alert check error:", e); }
    },

    notify(alert, price) {
        const condLabel = {
            above: `above $${alert.value}`,
            below: `below $${alert.value}`,
            pct_up: `up ${alert.value}%`,
            pct_down: `down ${alert.value}%`,
            vol_above: `volume above ${alert.value}`
        }[alert.condition];
        const msg = `${alert.ticker} hit alert: ${condLabel} (Price: $${price.toFixed(2)})`;
        this.showToast(msg);
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Trading Terminal Alert", { body: msg });
        }
    },

    showToast(msg) {
        const toast = document.getElementById("alert-toast");
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 5000);
    },

    openModal() {
        document.getElementById("alert-modal").classList.add("show");
        this.renderModal();
    },

    closeModal() {
        document.getElementById("alert-modal").classList.remove("show");
    },

    renderModal() {
        const body = document.getElementById("alert-list");
        let html = `<div class="alert-form">
            <input type="text" id="alert-ticker" placeholder="TICKER" maxlength="5">
            <select id="alert-condition">
                <option value="above">Price Above</option>
                <option value="below">Price Below</option>
                <option value="pct_up">% Up</option>
                <option value="pct_down">% Down</option>
                <option value="vol_above">Volume Above</option>
            </select>
            <input type="number" id="alert-value" placeholder="Value">
            <button onclick="Alerts.addFromModal()">ADD</button>
        </div><div class="alert-items">`;
        this.alerts.forEach(a => {
            const status = a.triggered ? '<span class="alert-fired">FIRED</span>' : '<span class="alert-active">ACTIVE</span>';
            const condLabel = {above:"Above",below:"Below",pct_up:"%Up",pct_down:"%Down",vol_above:"Vol>"}[a.condition];
            html += `<div class="alert-item">
                <span class="alert-info">${a.ticker} ${condLabel} ${a.value}</span>
                ${status}
                <button onclick="Alerts.remove(${a.id});Alerts.renderModal()">×</button>
            </div>`;
        });
        html += "</div>";
        body.innerHTML = html;
    },

    addFromModal() {
        const ticker = document.getElementById("alert-ticker").value;
        const condition = document.getElementById("alert-condition").value;
        const value = document.getElementById("alert-value").value;
        if (!ticker || !value) return;
        this.add(ticker, condition, value);
        this.renderModal();
    }
};
