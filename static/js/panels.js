const Panels = {
    async loadGainers() {
        const panel = document.getElementById("tab-gainers");
        panel.innerHTML = '<div class="loading">SCANNING DAY GAINERS...</div>';
        try {
            const res = await fetch("/api/gainers");
            const data = await res.json();
            panel.innerHTML = this._buildTable(data, [
                {key:"ticker",label:"TICKER",fmt:v=>`<span class="ticker">${v}</span>`},
                {key:"name",label:"NAME",fmt:v=>Screener.truncate(v,20)},
                {key:"price",label:"PRICE",fmt:v=>"$"+v.toFixed(2)},
                {key:"changePct",label:"CHG%",fmt:(v)=>`<span class="green">+${v.toFixed(2)}%</span>`},
                {key:"change",label:"CHG $",fmt:(v)=>`<span class="green">+$${v.toFixed(2)}</span>`},
                {key:"volume",label:"VOLUME",fmt:Screener.formatVolume},
                {key:"marketCap",label:"MKT CAP",fmt:Screener.formatMarketCap}
            ]);
        } catch(e) { panel.innerHTML = '<div class="loading error">FAILED</div>'; }
    },

    async loadTrending() {
        const panel = document.getElementById("tab-trending");
        panel.innerHTML = '<div class="loading">SCANNING TRENDING STOCKS...</div>';
        try {
            const res = await fetch("/api/trending");
            const data = await res.json();
            panel.innerHTML = this._buildTable(data, [
                {key:"ticker",label:"TICKER",fmt:v=>`<span class="ticker">${v}</span>`},
                {key:"name",label:"NAME",fmt:v=>Screener.truncate(v,20)},
                {key:"price",label:"PRICE",fmt:v=>"$"+v.toFixed(2)},
                {key:"changePct",label:"CHG%",fmt:(v)=>`<span class="${v>=0?'green':'red'}">${v>=0?'+':''}${v.toFixed(2)}%</span>`},
                {key:"volRatio",label:"VOL RATIO",fmt:v=>v.toFixed(1)+"x"},
                {key:"trendScore",label:"TREND SCORE",fmt:v=>`<span style="color:var(--orange)">${v.toFixed(0)}</span>`},
                {key:"volume",label:"VOLUME",fmt:Screener.formatVolume}
            ]);
        } catch(e) { panel.innerHTML = '<div class="loading error">FAILED</div>'; }
    },

    async loadDividend() {
        const panel = document.getElementById("tab-dividend");
        panel.innerHTML = '<div class="loading">SCANNING HIGHEST DIVIDEND...</div>';
        try {
            const res = await fetch("/api/dividend");
            const data = await res.json();
            panel.innerHTML = this._buildTable(data, [
                {key:"ticker",label:"TICKER",fmt:v=>`<span class="ticker">${v}</span>`},
                {key:"name",label:"NAME",fmt:v=>Screener.truncate(v,20)},
                {key:"price",label:"PRICE",fmt:v=>"$"+(v||0).toFixed(2)},
                {key:"dividendYield",label:"DIV YIELD",fmt:v=>`<span class="green">${v.toFixed(2)}%</span>`},
                {key:"pe",label:"P/E",fmt:v=>v ? v.toFixed(1) : "—"},
                {key:"eps",label:"EPS",fmt:v=>v ? "$"+v.toFixed(2) : "—"},
                {key:"marketCap",label:"MKT CAP",fmt:Screener.formatMarketCap}
            ]);
        } catch(e) { panel.innerHTML = '<div class="loading error">FAILED</div>'; }
    },

    async loadSmallCap() {
        const panel = document.getElementById("tab-smallcap");
        panel.innerHTML = '<div class="loading">SCANNING SMALL CAP STOCKS...</div>';
        try {
            const res = await fetch("/api/small-cap");
            const data = await res.json();
            panel.innerHTML = this._buildTable(data, [
                {key:"ticker",label:"TICKER",fmt:v=>`<span class="ticker">${v}</span>`},
                {key:"name",label:"NAME",fmt:v=>Screener.truncate(v,20)},
                {key:"price",label:"PRICE",fmt:v=>"$"+(v||0).toFixed(2)},
                {key:"changePct",label:"CHG%",fmt:(v)=>`<span class="${v>=0?'green':'red'}">${v>=0?'+':''}${v.toFixed(2)}%</span>`},
                {key:"marketCap",label:"MKT CAP",fmt:Screener.formatMarketCap},
                {key:"beta",label:"BETA",fmt:v=>v ? v.toFixed(2) : "—"},
                {key:"volume",label:"VOLUME",fmt:Screener.formatVolume}
            ]);
        } catch(e) { panel.innerHTML = '<div class="loading error">FAILED</div>'; }
    },

    async loadLargeCap() {
        const panel = document.getElementById("tab-largecap");
        panel.innerHTML = '<div class="loading">SCANNING LARGE CAP STOCKS...</div>';
        try {
            const res = await fetch("/api/large-cap");
            const data = await res.json();
            panel.innerHTML = this._buildTable(data, [
                {key:"ticker",label:"TICKER",fmt:v=>`<span class="ticker">${v}</span>`},
                {key:"name",label:"NAME",fmt:v=>Screener.truncate(v,20)},
                {key:"price",label:"PRICE",fmt:v=>"$"+(v||0).toFixed(2)},
                {key:"changePct",label:"CHG%",fmt:(v)=>`<span class="${v>=0?'green':'red'}">${v>=0?'+':''}${v.toFixed(2)}%</span>`},
                {key:"marketCap",label:"MKT CAP",fmt:Screener.formatMarketCap},
                {key:"pe",label:"P/E",fmt:v=>v ? v.toFixed(1) : "—"},
                {key:"volume",label:"VOLUME",fmt:Screener.formatVolume}
            ]);
        } catch(e) { panel.innerHTML = '<div class="loading error">FAILED</div>'; }
    },

    async loadExpensive() {
        const panel = document.getElementById("tab-expensive");
        panel.innerHTML = '<div class="loading">SCANNING MOST EXPENSIVE...</div>';
        try {
            const res = await fetch("/api/expensive");
            const data = await res.json();
            panel.innerHTML = this._buildTable(data, [
                {key:"ticker",label:"TICKER",fmt:v=>`<span class="ticker">${v}</span>`},
                {key:"name",label:"NAME",fmt:v=>Screener.truncate(v,20)},
                {key:"price",label:"PRICE",fmt:v=>`<span style="color:var(--orange)">$${v.toFixed(2)}</span>`},
                {key:"changePct",label:"CHG%",fmt:(v)=>`<span class="${v>=0?'green':'red'}">${v>=0?'+':''}${v.toFixed(2)}%</span>`},
                {key:"pe",label:"P/E",fmt:v=>v ? v.toFixed(1) : "—"},
                {key:"marketCap",label:"MKT CAP",fmt:Screener.formatMarketCap},
                {key:"volume",label:"VOLUME",fmt:Screener.formatVolume}
            ]);
        } catch(e) { panel.innerHTML = '<div class="loading error">FAILED</div>'; }
    },

    async loadHighBeta() {
        const panel = document.getElementById("tab-highbeta");
        panel.innerHTML = '<div class="loading">SCANNING HIGHEST BETA...</div>';
        try {
            const res = await fetch("/api/high-beta");
            const data = await res.json();
            panel.innerHTML = this._buildTable(data, [
                {key:"ticker",label:"TICKER",fmt:v=>`<span class="ticker">${v}</span>`},
                {key:"name",label:"NAME",fmt:v=>Screener.truncate(v,20)},
                {key:"price",label:"PRICE",fmt:v=>"$"+(v||0).toFixed(2)},
                {key:"beta",label:"BETA",fmt:v=>`<span style="color:${v>2?'var(--red)':v>1.5?'var(--orange)':'var(--text)'}">${v.toFixed(2)}</span>`},
                {key:"changePct",label:"CHG%",fmt:(v)=>`<span class="${v>=0?'green':'red'}">${v>=0?'+':''}${v.toFixed(2)}%</span>`},
                {key:"marketCap",label:"MKT CAP",fmt:Screener.formatMarketCap},
                {key:"volume",label:"VOLUME",fmt:Screener.formatVolume}
            ]);
        } catch(e) { panel.innerHTML = '<div class="loading error">FAILED</div>'; }
    },

    async loadUnusualVol() {
        const panel = document.getElementById("tab-unusualvol");
        panel.innerHTML = '<div class="loading">SCANNING UNUSUAL VOLUME...</div>';
        try {
            const res = await fetch("/api/unusual-volume");
            const data = await res.json();
            panel.innerHTML = this._buildTable(data, [
                {key:"ticker",label:"TICKER",fmt:v=>`<span class="ticker">${v}</span>`},
                {key:"name",label:"NAME",fmt:v=>Screener.truncate(v,20)},
                {key:"price",label:"PRICE",fmt:v=>"$"+v.toFixed(2)},
                {key:"changePct",label:"CHG%",fmt:(v)=>`<span class="${v>=0?'green':'red'}">${v>=0?'+':''}${v.toFixed(2)}%</span>`},
                {key:"volRatio",label:"VOL RATIO",fmt:v=>`<span style="color:var(--orange)">${v.toFixed(1)}x</span>`},
                {key:"volume",label:"VOLUME",fmt:Screener.formatVolume},
                {key:"avgVolume",label:"AVG VOL",fmt:Screener.formatVolume}
            ]);
        } catch(e) { panel.innerHTML = '<div class="loading error">FAILED</div>'; }
    },

    async load52wGainers() {
        const panel = document.getElementById("tab-52wgainers");
        panel.innerHTML = '<div class="loading">SCANNING 52-WEEK GAINERS...</div>';
        try {
            const res = await fetch("/api/52w-gainers");
            const data = await res.json();
            panel.innerHTML = this._buildTable(data, [
                {key:"ticker",label:"TICKER",fmt:v=>`<span class="ticker">${v}</span>`},
                {key:"name",label:"NAME",fmt:v=>Screener.truncate(v,20)},
                {key:"price",label:"PRICE",fmt:v=>"$"+v.toFixed(2)},
                {key:"gainFromLow",label:"GAIN FROM 52W LOW",fmt:v=>`<span class="green">+${v.toFixed(1)}%</span>`},
                {key:"fiftyTwoWeekLow",label:"52W LOW",fmt:v=>"$"+v.toFixed(2)},
                {key:"fiftyTwoWeekHigh",label:"52W HIGH",fmt:v=>"$"+v.toFixed(2)},
                {key:"pctOfHigh",label:"% OF HIGH",fmt:v=>v.toFixed(1)+"%"}
            ]);
        } catch(e) { panel.innerHTML = '<div class="loading error">FAILED</div>'; }
    },

    async load52wLosers() {
        const panel = document.getElementById("tab-52wlosers");
        panel.innerHTML = '<div class="loading">SCANNING 52-WEEK LOSERS...</div>';
        try {
            const res = await fetch("/api/52w-losers");
            const data = await res.json();
            panel.innerHTML = this._buildTable(data, [
                {key:"ticker",label:"TICKER",fmt:v=>`<span class="ticker">${v}</span>`},
                {key:"name",label:"NAME",fmt:v=>Screener.truncate(v,20)},
                {key:"price",label:"PRICE",fmt:v=>"$"+v.toFixed(2)},
                {key:"dropFromHigh",label:"DROP FROM 52W HIGH",fmt:v=>`<span class="red">${v.toFixed(1)}%</span>`},
                {key:"fiftyTwoWeekHigh",label:"52W HIGH",fmt:v=>"$"+v.toFixed(2)},
                {key:"fiftyTwoWeekLow",label:"52W LOW",fmt:v=>"$"+v.toFixed(2)},
                {key:"pctOfHigh",label:"% OF HIGH",fmt:v=>v.toFixed(1)+"%"}
            ]);
        } catch(e) { panel.innerHTML = '<div class="loading error">FAILED</div>'; }
    },

    async loadVolatile() {
        const panel = document.getElementById("tab-volatile");
        panel.innerHTML = '<div class="loading">SCANNING MOST VOLATILE...</div>';
        try {
            const res = await fetch("/api/volatile");
            const data = await res.json();
            panel.innerHTML = this._buildTable(data, [
                {key:"ticker",label:"TICKER",fmt:v=>`<span class="ticker">${v}</span>`},
                {key:"name",label:"NAME",fmt:v=>Screener.truncate(v,20)},
                {key:"price",label:"PRICE",fmt:v=>"$"+v.toFixed(2)},
                {key:"changePct",label:"CHG%",fmt:(v)=>`<span class="${v>=0?'green':'red'}">${v>=0?'+':''}${v.toFixed(2)}%</span>`},
                {key:"range",label:"RANGE%",fmt:v=>v.toFixed(2)+"%"},
                {key:"volume",label:"VOLUME",fmt:Screener.formatVolume}
            ]);
        } catch(e) { panel.innerHTML = '<div class="loading error">FAILED</div>'; }
    },

    async loadActive() {
        const panel = document.getElementById("tab-active");
        panel.innerHTML = '<div class="loading">SCANNING MOST ACTIVE...</div>';
        try {
            const res = await fetch("/api/active");
            const data = await res.json();
            panel.innerHTML = this._buildTable(data, [
                {key:"ticker",label:"TICKER",fmt:v=>`<span class="ticker">${v}</span>`},
                {key:"name",label:"NAME",fmt:v=>Screener.truncate(v,20)},
                {key:"price",label:"PRICE",fmt:v=>"$"+v.toFixed(2)},
                {key:"changePct",label:"CHG%",fmt:(v)=>`<span class="${v>=0?'green':'red'}">${v>=0?'+':''}${v.toFixed(2)}%</span>`},
                {key:"volume",label:"VOLUME",fmt:Screener.formatVolume},
                {key:"dollarVolume",label:"$ VOLUME",fmt:v=>Screener.formatMarketCap(v)}
            ]);
        } catch(e) { panel.innerHTML = '<div class="loading error">FAILED</div>'; }
    },

    async loadLosers() {
        const panel = document.getElementById("tab-losers");
        panel.innerHTML = '<div class="loading">SCANNING BIGGEST LOSERS...</div>';
        try {
            const res = await fetch("/api/losers");
            const data = await res.json();
            panel.innerHTML = this._buildTable(data, [
                {key:"ticker",label:"TICKER",fmt:v=>`<span class="ticker">${v}</span>`},
                {key:"name",label:"NAME",fmt:v=>Screener.truncate(v,20)},
                {key:"price",label:"PRICE",fmt:v=>"$"+v.toFixed(2)},
                {key:"changePct",label:"CHG%",fmt:(v)=>`<span class="red">${v.toFixed(2)}%</span>`},
                {key:"volume",label:"VOLUME",fmt:Screener.formatVolume},
                {key:"marketCap",label:"MKT CAP",fmt:Screener.formatMarketCap}
            ]);
        } catch(e) { panel.innerHTML = '<div class="loading error">FAILED</div>'; }
    },

    async loadAfterHours() {
        const panel = document.getElementById("tab-afterhours");
        panel.innerHTML = '<div class="loading">SCANNING AFTER-HOURS MOVERS...</div>';
        try {
            const res = await fetch("/api/after-hours");
            const data = await res.json();
            panel.innerHTML = this._buildTable(data, [
                {key:"ticker",label:"TICKER",fmt:v=>`<span class="ticker">${v}</span>`},
                {key:"name",label:"NAME",fmt:v=>Screener.truncate(v,20)},
                {key:"regularPrice",label:"REG CLOSE",fmt:v=>"$"+(v||0).toFixed(2)},
                {key:"extendedPrice",label:"AH PRICE",fmt:v=>"$"+(v||0).toFixed(2)},
                {key:"ahChangePct",label:"AH CHG%",fmt:(v)=>`<span class="${(v||0)>=0?'green':'red'}">${(v||0)>=0?'+':''}${(v||0).toFixed(2)}%</span>`},
                {key:"volume",label:"VOLUME",fmt:Screener.formatVolume}
            ]);
        } catch(e) { panel.innerHTML = '<div class="loading error">FAILED</div>'; }
    },

    async loadSqueeze() {
        const panel = document.getElementById("tab-squeeze");
        panel.innerHTML = '<div class="loading">ANALYZING SHORT SQUEEZE CANDIDATES...<br><span style="font-size:10px;color:#666;">Scanning 40 tickers for squeeze signals</span></div>';
        try {
            const res = await fetch("/api/short-squeeze");
            const data = await res.json();
            if (!data.length) { panel.innerHTML = '<div class="loading">NO SQUEEZE CANDIDATES FOUND</div>'; return; }
            let html = '';
            data.forEach((s, i) => {
                const sc = s.squeezeScore || 0;
                const scoreColor = sc >= 70 ? 'var(--red)' : sc >= 50 ? 'var(--orange)' : sc >= 30 ? 'var(--yellow)' : 'var(--green)';
                const riskClass = sc >= 70 ? 'extreme' : sc >= 50 ? 'high' : sc >= 30 ? 'moderate' : 'low';
                const riskLabel = sc >= 70 ? 'EXTREME' : sc >= 50 ? 'HIGH' : sc >= 30 ? 'MODERATE' : 'LOW';

                html += `<div class="sq-row">
                    <div class="sq-header">
                        <span class="sq-ticker" onclick="App.showDetail('${s.ticker}')">${s.ticker}</span>
                        <span class="sq-name">${s.name || ''}</span>
                        <span class="sq-risk ${riskClass}">${riskLabel}</span>
                        <div class="sq-score-bar"><div class="sq-score-fill" style="width:${sc}%;background:${scoreColor}"></div></div>
                        <span class="sq-score-label" style="color:${scoreColor}">${sc}/100</span>
                    </div>
                    <div class="sq-grid">
                        <div class="sq-stat"><span class="sq-stat-label">SI %</span><span class="sq-stat-value ${(s.shortPct||0) > 20 ? 'red' : ''}">${(s.shortPct||0).toFixed(1)}%</span></div>
                        <div class="sq-stat"><span class="sq-stat-label">DAYS TO COVER</span><span class="sq-stat-value">${(s.shortRatio||0).toFixed(1)}</span></div>
                        <div class="sq-stat"><span class="sq-stat-label">FLOAT</span><span class="sq-stat-value">${Screener.formatVolume(s.floatShares)}</span></div>
                        <div class="sq-stat"><span class="sq-stat-label">VOL RATIO</span><span class="sq-stat-value">${(s.volRatio||0).toFixed(1)}x</span></div>
                        <div class="sq-stat"><span class="sq-stat-label">PRICE</span><span class="sq-stat-value">$${(s.price||0).toFixed(2)}</span></div>
                    </div>
                    <button class="sq-thesis-btn" onclick="Panels.toggleThesis(${i})">▶ WHY THIS COULD SQUEEZE</button>
                    <div class="sq-thesis" id="thesis-${i}">${s.thesis || 'No analysis available'}</div>`;

                if (s.news && s.news.length) {
                    html += `<div class="sq-news"><div class="sq-news-title">📰 RELATED NEWS & CATALYSTS</div>`;
                    s.news.forEach(n => {
                        const url = n.url || n.link || '#';
                        const headline = n.title || 'Untitled';
                        const source = n.source || n.publisher || 'Unknown';
                        html += `<div class="sq-news-item">
                            <a class="sq-news-headline" href="${url}" target="_blank" rel="noopener">${headline}</a>
                            <div class="sq-news-source">${source}</div>
                        </div>`;
                    });
                    html += `</div>`;
                }

                html += `<div class="sq-edu">
                    <strong>What makes this a squeeze candidate?</strong> When ${(s.shortPct||0).toFixed(1)}% of the float is sold short and it takes ${(s.shortRatio||0).toFixed(1)} days to cover, any positive catalyst forces shorts to buy back shares — driving the price up rapidly as supply dries up. ${(s.volRatio||0) > 1.5 ? 'Current volume is ' + (s.volRatio||0).toFixed(1) + 'x normal, suggesting buying pressure is building.' : ''}
                </div>`;

                html += `</div>`;
            });
            panel.innerHTML = html;
        } catch(e) { panel.innerHTML = '<div class="loading error">FAILED TO LOAD SQUEEZE DATA</div>'; }
    },

    toggleThesis(idx) {
        const el = document.getElementById("thesis-" + idx);
        if (el) el.classList.toggle("show");
    },

    loadLearn() {
        const panel = document.getElementById("tab-learn");
        panel.innerHTML = `<div class="tab-learn">
            <div class="learn-header">
                <h2>TRADING KNOWLEDGE CENTER</h2>
                <p>From beginner to expert — everything you need to understand the markets</p>
            </div>

            ${this._learnLevel('BEGINNER', 'beginner', [
                {title: 'What Is a Stock?', body: `<h4>Definition</h4>
                    <p>A stock represents partial ownership in a company. When you buy a share of stock, you become a part-owner (shareholder) of that company.</p>
                    <h4>Why Companies Issue Stock</h4>
                    <p>Companies sell shares to raise money for growth, research, expansion, or paying off debt. In return, investors get potential for profit through price appreciation and dividends.</p>
                    <div class="learn-example">Example: If a company has 1,000,000 shares outstanding and you own 1,000 shares, you own 0.1% of that company.</div>
                    <h4>Types of Stock</h4>
                    <table class="learn-table">
                        <tr><th>Type</th><th>Voting Rights</th><th>Dividends</th><th>Risk</th></tr>
                        <tr><td>Common Stock</td><td>Yes</td><td>Variable</td><td>Higher</td></tr>
                        <tr><td>Preferred Stock</td><td>Usually No</td><td>Fixed</td><td>Lower</td></tr>
                    </table>`},
                {title: 'Understanding OHLCV (Price Bars)', body: `<h4>The 5 Key Data Points</h4>
                    <table class="learn-table">
                        <tr><th>Letter</th><th>Meaning</th><th>What It Tells You</th></tr>
                        <tr><td>O</td><td>Open</td><td>Price at market open</td></tr>
                        <tr><td>H</td><td>High</td><td>Highest price of the day</td></tr>
                        <tr><td>L</td><td>Low</td><td>Lowest price of the day</td></tr>
                        <tr><td>C</td><td>Close</td><td>Final price at market close</td></tr>
                        <tr><td>V</td><td>Volume</td><td>Number of shares traded</td></tr>
                    </table>
                    <div class="learn-example">Example: AAPL O:185.50 H:188.20 L:184.90 C:187.30 V:52.3M — Apple opened at $185.50, reached a high of $188.20, dropped to $184.90, and closed at $187.30 with 52.3 million shares traded.</div>`},
                {title: 'Market Capitalization', body: `<h4>Formula</h4>
                    <p>Market Cap = Share Price × Total Shares Outstanding</p>
                    <h4>Size Categories</h4>
                    <table class="learn-table">
                        <tr><th>Category</th><th>Market Cap</th><th>Examples</th></tr>
                        <tr><td>Mega Cap</td><td>$200B+</td><td>AAPL, MSFT, GOOGL</td></tr>
                        <tr><td>Large Cap</td><td>$10B - $200B</td><td>CRM, NFLX</td></tr>
                        <tr><td>Mid Cap</td><td>$2B - $10B</td><td>ETSY, ROKU</td></tr>
                        <tr><td>Small Cap</td><td>$300M - $2B</td><td>Higher volatility</td></tr>
                        <tr><td>Micro Cap</td><td>&lt;$300M</td><td>Very high risk</td></tr>
                    </table>
                    <div class="learn-warning">⚠ Smaller market cap = higher volatility = higher risk. Day traders often focus on small/mid cap stocks for bigger moves.</div>`},
                {title: 'Market Sectors', body: `<h4>The 11 GICS Sectors</h4>
                    <table class="learn-table">
                        <tr><th>Sector</th><th>Examples</th><th>Character</th></tr>
                        <tr><td>Technology</td><td>AAPL, MSFT, NVDA</td><td>Growth, volatile</td></tr>
                        <tr><td>Healthcare</td><td>JNJ, UNH, PFE</td><td>Defensive, steady</td></tr>
                        <tr><td>Financials</td><td>JPM, BAC, GS</td><td>Rate-sensitive</td></tr>
                        <tr><td>Consumer Disc.</td><td>AMZN, TSLA, NKE</td><td>Economic cycle</td></tr>
                        <tr><td>Comm. Services</td><td>GOOGL, META, DIS</td><td>Mixed growth</td></tr>
                        <tr><td>Industrials</td><td>BA, CAT, UPS</td><td>Economic cycle</td></tr>
                        <tr><td>Consumer Staples</td><td>PG, KO, WMT</td><td>Defensive</td></tr>
                        <tr><td>Energy</td><td>XOM, CVX, COP</td><td>Oil-dependent</td></tr>
                        <tr><td>Utilities</td><td>NEE, DUK, SO</td><td>Stable, dividends</td></tr>
                        <tr><td>Real Estate</td><td>AMT, PLD, SPG</td><td>Rate-sensitive</td></tr>
                        <tr><td>Materials</td><td>LIN, APD, FCX</td><td>Commodity-linked</td></tr>
                    </table>
                    <p>Use the sector bar at the top of this terminal to see how each sector is performing today.</p>`}
            ])}

            ${this._learnLevel('INTERMEDIATE', 'intermediate', [
                {title: 'P/E Ratio & Valuation', body: `<h4>Price-to-Earnings Ratio</h4>
                    <p>P/E = Stock Price ÷ Earnings Per Share (EPS)</p>
                    <p>It tells you how much investors are willing to pay for each dollar of earnings.</p>
                    <table class="learn-table">
                        <tr><th>P/E Range</th><th>Interpretation</th></tr>
                        <tr><td>&lt;15</td><td>Potentially undervalued or slow growth</td></tr>
                        <tr><td>15–25</td><td>Fair value for most sectors</td></tr>
                        <tr><td>25–50</td><td>High growth expected</td></tr>
                        <tr><td>50+</td><td>Very high growth priced in — risky</td></tr>
                        <tr><td>Negative</td><td>Company is losing money</td></tr>
                    </table>
                    <div class="learn-warning">⚠ P/E alone doesn't tell the whole story. Always compare within the same sector. A tech company at 30 P/E might be cheap while a utility at 30 P/E is expensive.</div>`},
                {title: 'Volume Analysis', body: `<h4>Why Volume Matters</h4>
                    <p>Volume confirms price movements. A big price move on high volume is more significant than the same move on low volume.</p>
                    <h4>Volume Ratio</h4>
                    <p>Volume Ratio = Today's Volume ÷ Average Volume</p>
                    <table class="learn-table">
                        <tr><th>Vol Ratio</th><th>Meaning</th></tr>
                        <tr><td>&lt;0.5x</td><td>Unusually quiet — low interest</td></tr>
                        <tr><td>0.5–1.5x</td><td>Normal trading</td></tr>
                        <tr><td>1.5–3x</td><td>Above average — something happening</td></tr>
                        <tr><td>3x+</td><td>Surge — news, earnings, or squeeze</td></tr>
                    </table>
                    <div class="learn-example">Example: If TSLA normally trades 80M shares but today trades 200M, the vol ratio is 2.5x. This suggests major interest — check the news!</div>`},
                {title: '52-Week Range & Beta', body: `<h4>52-Week Range</h4>
                    <p>Shows the lowest and highest price a stock has traded at in the past year. The range bar in the detail view shows where the current price sits relative to this range.</p>
                    <div class="learn-example">Example: If the 52-week range is $100–$200 and the stock is at $110, it's trading near its yearly low — potentially a buying opportunity OR a falling knife.</div>
                    <h4>Beta</h4>
                    <p>Measures a stock's volatility relative to the overall market (S&P 500 = beta of 1.0).</p>
                    <table class="learn-table">
                        <tr><th>Beta</th><th>Meaning</th></tr>
                        <tr><td>&lt;1</td><td>Less volatile than market (defensive)</td></tr>
                        <tr><td>1</td><td>Moves with the market</td></tr>
                        <tr><td>&gt;1</td><td>More volatile (aggressive/growth)</td></tr>
                        <tr><td>&gt;2</td><td>Very volatile — twice the market swings</td></tr>
                    </table>`}
            ])}

            ${this._learnLevel('ADVANCED', 'advanced', [
                {title: 'Short Selling Mechanics', body: `<h4>How Short Selling Works</h4>
                    <ol class="learn-steps">
                        <li>Borrow shares from your broker</li>
                        <li>Sell borrowed shares at current price</li>
                        <li>Wait for price to drop</li>
                        <li>Buy back shares at lower price</li>
                        <li>Return shares to broker, keep the difference</li>
                    </ol>
                    <div class="learn-example">Example: You short 100 shares of XYZ at $50 ($5,000). Price drops to $40. You buy back for $4,000. Profit = $1,000 minus fees.</div>
                    <h4>Key Metrics</h4>
                    <table class="learn-table">
                        <tr><th>Metric</th><th>What It Means</th></tr>
                        <tr><td>Short Interest %</td><td>% of float sold short — above 20% is high</td></tr>
                        <tr><td>Days to Cover</td><td>Short shares ÷ avg daily volume — how many days to close all shorts</td></tr>
                        <tr><td>Short Interest Ratio</td><td>Same as days to cover — above 5 is significant</td></tr>
                    </table>
                    <div class="learn-warning">⚠ Short selling has UNLIMITED risk. If the stock goes up instead of down, your losses grow without limit. This is why short squeezes are so powerful.</div>`},
                {title: 'Short Squeeze Mechanics', body: `<h4>What Is a Short Squeeze?</h4>
                    <p>A short squeeze occurs when a heavily shorted stock rises sharply, forcing short sellers to buy back shares (cover) to limit losses, which pushes the price even higher in a feedback loop.</p>
                    <h4>The Squeeze Cycle</h4>
                    <ol class="learn-steps">
                        <li>Stock has high short interest (many bets against it)</li>
                        <li>Positive catalyst hits (earnings beat, news, social media)</li>
                        <li>Price starts rising</li>
                        <li>Short sellers face mounting losses</li>
                        <li>Margin calls force shorts to buy (cover)</li>
                        <li>Forced buying pushes price higher</li>
                        <li>More shorts get squeezed — feedback loop</li>
                        <li>Price spikes dramatically (can be 50-500%+)</li>
                    </ol>
                    <h4>Squeeze Signals (what this terminal scans for)</h4>
                    <table class="learn-table">
                        <tr><th>Signal</th><th>Strong Setup</th></tr>
                        <tr><td>Short Interest %</td><td>Above 20% of float</td></tr>
                        <tr><td>Days to Cover</td><td>Above 5 days</td></tr>
                        <tr><td>Volume Surge</td><td>Above 2x average</td></tr>
                        <tr><td>Price Momentum</td><td>Already trending up</td></tr>
                        <tr><td>Low Float</td><td>Under 50M shares — easier to move</td></tr>
                    </table>
                    <div class="learn-warning">⚠ Squeezes are EXTREMELY risky. They spike fast but crash just as fast. Never go "all in" on a squeeze play. Use strict stop losses.</div>`},
                {title: 'Pre-Market & After-Hours Trading', body: `<h4>Extended Hours Sessions</h4>
                    <table class="learn-table">
                        <tr><th>Session</th><th>Hours (ET)</th><th>Character</th></tr>
                        <tr><td>Pre-Market</td><td>4:00 AM – 9:30 AM</td><td>Low volume, wide spreads</td></tr>
                        <tr><td>Regular</td><td>9:30 AM – 4:00 PM</td><td>Full liquidity</td></tr>
                        <tr><td>After-Hours</td><td>4:00 PM – 8:00 PM</td><td>Earnings reactions, low volume</td></tr>
                    </table>
                    <h4>Key Points</h4>
                    <p>• Extended hours have lower volume and wider bid-ask spreads<br>
                    • Big earnings announcements cause major after-hours moves<br>
                    • Pre-market sets the tone for the regular session<br>
                    • Use the "After Hours" tab to spot stocks moving after close</p>
                    <div class="learn-warning">⚠ Extended hours prices can be misleading due to low liquidity. A stock up 10% after hours might open only 3% up during regular trading.</div>`}
            ])}

            ${this._learnLevel('GLOSSARY', 'glossary', [
                {title: 'Price & Quote Abbreviations', body: `<h4>Every Short Form You See on a Trading Screen</h4>
                    <table class="learn-table">
                        <tr><th>Abbr.</th><th>Full Form</th><th>What It Means in Plain English</th></tr>
                        <tr><td><strong>O / OPEN</strong></td><td>Opening Price</td><td>The very first price a stock trades at when the market opens at 9:30 AM ET. It often gaps up or down from yesterday's close based on overnight news.</td></tr>
                        <tr><td><strong>H / HIGH</strong></td><td>High Price</td><td>The highest price the stock reached during the trading session. Day traders watch this as a resistance level — if price breaks above today's high, it signals strength.</td></tr>
                        <tr><td><strong>L / LOW</strong></td><td>Low Price</td><td>The lowest price during the session. Acts as a support level — if price falls below it, that's a bearish sign.</td></tr>
                        <tr><td><strong>C / CLOSE</strong></td><td>Closing Price</td><td>The final price when the market closes at 4:00 PM ET. This is the most important price of the day — it's what gets recorded in history and what charts plot.</td></tr>
                        <tr><td><strong>V / VOL</strong></td><td>Volume</td><td>Total number of shares traded. High volume = more people are interested = more reliable price moves. Low volume moves are often fake-outs.</td></tr>
                        <tr><td><strong>OHLCV</strong></td><td>Open-High-Low-Close-Volume</td><td>The five essential data points for any time period (day, hour, minute). Every candlestick chart is built from OHLCV data.</td></tr>
                        <tr><td><strong>BID</strong></td><td>Bid Price</td><td>The highest price a buyer is currently willing to pay. If you sell "at market," you'll get the bid price.</td></tr>
                        <tr><td><strong>ASK</strong></td><td>Ask / Offer Price</td><td>The lowest price a seller is willing to accept. If you buy "at market," you'll pay the ask price.</td></tr>
                        <tr><td><strong>SPREAD</strong></td><td>Bid-Ask Spread</td><td>The gap between bid and ask. Tight spread ($0.01) = liquid stock (easy to trade). Wide spread ($0.10+) = less liquid, harder to get a good fill.</td></tr>
                        <tr><td><strong>LAST</strong></td><td>Last Traded Price</td><td>The price at which the most recent trade happened. This is what the "live price" shows you.</td></tr>
                        <tr><td><strong>CHG / CHG%</strong></td><td>Change / Change Percent</td><td>How much the price moved from yesterday's close. +2.5% means the stock is up 2.5% today.</td></tr>
                        <tr><td><strong>PREV</strong></td><td>Previous Close</td><td>Yesterday's closing price. Today's change% is calculated from this number.</td></tr>
                        <tr><td><strong>VWAP</strong></td><td>Volume-Weighted Avg Price</td><td>The average price weighted by volume throughout the day. Institutional traders use this as a benchmark — buying below VWAP is considered "good execution."</td></tr>
                    </table>
                    <div class="learn-example">Example: If AAPL shows BID: $185.50, ASK: $185.52, SPREAD: $0.02, LAST: $185.51 — the stock is very liquid (penny spread), and the most recent trade was right in the middle.</div>`},

                {title: 'Volume & Liquidity Terms', body: `<h4>Understanding How Much Trading Activity Is Happening</h4>
                    <table class="learn-table">
                        <tr><th>Abbr.</th><th>Full Form</th><th>What It Means in Plain English</th></tr>
                        <tr><td><strong>AVG VOL</strong></td><td>Average Volume</td><td>The typical number of shares traded per day, usually averaged over 50 or 90 days. Compare today's volume to this to know if activity is unusual.</td></tr>
                        <tr><td><strong>VOL RATIO</strong></td><td>Volume Ratio</td><td>Today's Volume ÷ Average Volume. A ratio of 3x means 3 times more shares are trading than normal — something big is happening.</td></tr>
                        <tr><td><strong>$ VOL</strong></td><td>Dollar Volume</td><td>Volume × Price. A $5 stock trading 10M shares ($50M dollar vol) is very different from a $500 stock trading 10M shares ($5B dollar vol).</td></tr>
                        <tr><td><strong>RVOL</strong></td><td>Relative Volume</td><td>Same as vol ratio but often compared at the same time of day. RVOL of 5 at 10am means 5x more volume than usual by 10am.</td></tr>
                        <tr><td><strong>FLOAT</strong></td><td>Float / Free Float</td><td>Shares available for public trading (excludes insider-held, locked-up shares). Low float (&lt;20M) = easier to move = more volatile.</td></tr>
                        <tr><td><strong>O/S</strong></td><td>Shares Outstanding</td><td>Total shares that exist for the company (including insider shares). Float ≤ Outstanding.</td></tr>
                        <tr><td><strong>T&S</strong></td><td>Time & Sales</td><td>A live feed showing every individual trade: time, price, and size. Also called "the tape" — watching it helps you see if big buyers or sellers are active.</td></tr>
                        <tr><td><strong>LOT</strong></td><td>Round Lot</td><td>100 shares. Traditionally, stocks trade in lots of 100. An "odd lot" is less than 100 shares.</td></tr>
                        <tr><td><strong>AH / PM</strong></td><td>After-Hours / Pre-Market</td><td>Trading sessions outside regular hours (9:30–4:00). AH = 4:00–8:00 PM, PM = 4:00–9:30 AM. Lower volume and wider spreads.</td></tr>
                    </table>
                    <div class="learn-warning">⚠ Never confuse volume with price direction. High volume just means lots of activity — it can happen on both up days AND down days. Volume confirms the move, it doesn't predict it.</div>`},

                {title: 'Fundamental Analysis Abbreviations', body: `<h4>Numbers That Tell You If a Company Is Healthy</h4>
                    <table class="learn-table">
                        <tr><th>Abbr.</th><th>Full Form</th><th>What It Means in Plain English</th></tr>
                        <tr><td><strong>MKT CAP</strong></td><td>Market Capitalization</td><td>Share Price × Shares Outstanding = total value of the company on the stock market. Apple at ~$3T is the world's most valuable company.</td></tr>
                        <tr><td><strong>P/E</strong></td><td>Price-to-Earnings Ratio</td><td>Stock Price ÷ Earnings Per Share. Shows how much investors pay per $1 of profit. P/E of 25 means investors pay $25 for every $1 the company earns.</td></tr>
                        <tr><td><strong>EPS</strong></td><td>Earnings Per Share</td><td>Net Profit ÷ Shares Outstanding. If a company earned $1B and has 500M shares, EPS = $2.00. Higher is better.</td></tr>
                        <tr><td><strong>FWD P/E</strong></td><td>Forward P/E</td><td>P/E using next year's estimated earnings instead of last year's actual. A lower forward P/E than trailing P/E suggests analysts expect earnings growth.</td></tr>
                        <tr><td><strong>PEG</strong></td><td>Price/Earnings-to-Growth</td><td>P/E ÷ Annual EPS Growth Rate. PEG of 1 = fairly valued, &lt;1 = undervalued relative to growth, >2 = expensive.</td></tr>
                        <tr><td><strong>P/S</strong></td><td>Price-to-Sales Ratio</td><td>Market Cap ÷ Annual Revenue. Used for companies with no earnings (like growth startups). Lower is better.</td></tr>
                        <tr><td><strong>P/B</strong></td><td>Price-to-Book Ratio</td><td>Stock Price ÷ Book Value Per Share. Book value = assets minus liabilities. P/B &lt;1 means stock trades below its "liquidation value."</td></tr>
                        <tr><td><strong>ROE</strong></td><td>Return on Equity</td><td>Net Income ÷ Shareholder Equity × 100. Shows how efficiently a company uses investor money. 15%+ is generally good.</td></tr>
                        <tr><td><strong>ROA</strong></td><td>Return on Assets</td><td>Net Income ÷ Total Assets × 100. How well a company uses ALL its assets to make money. 5%+ is decent for most industries.</td></tr>
                        <tr><td><strong>D/E</strong></td><td>Debt-to-Equity Ratio</td><td>Total Debt ÷ Shareholder Equity. D/E of 2 means the company has $2 of debt for every $1 of equity. Lower = less risky.</td></tr>
                        <tr><td><strong>DIV / DY</strong></td><td>Dividend / Dividend Yield</td><td>Cash payment per share (DIV) and its annualized % return (DY). DY of 3% means you earn $3/year for every $100 invested, just from dividends.</td></tr>
                        <tr><td><strong>REV</strong></td><td>Revenue / Sales</td><td>Total money the company brought in (before expenses). Also called "top line" because it's the first line on the income statement.</td></tr>
                        <tr><td><strong>EBITDA</strong></td><td>Earnings Before Interest, Taxes, Depreciation & Amortization</td><td>A measure of operating profitability that strips out financing and accounting decisions. Used to compare companies across different tax situations.</td></tr>
                        <tr><td><strong>FCF</strong></td><td>Free Cash Flow</td><td>Cash from operations minus capital expenditures. This is the actual cash a company generates that it can use for dividends, buybacks, or growth.</td></tr>
                        <tr><td><strong>BV</strong></td><td>Book Value</td><td>Total Assets − Total Liabilities. What the company would theoretically be worth if liquidated today.</td></tr>
                        <tr><td><strong>NAV</strong></td><td>Net Asset Value</td><td>Used mainly for funds/ETFs. Total value of all holdings ÷ number of shares. Shows "true value" per share.</td></tr>
                        <tr><td><strong>YOY</strong></td><td>Year-Over-Year</td><td>Comparing this quarter/year to the same period last year. "Revenue up 20% YOY" means 20% more than the same quarter last year.</td></tr>
                        <tr><td><strong>QOQ</strong></td><td>Quarter-Over-Quarter</td><td>Comparing to the previous quarter. Shows sequential growth trends.</td></tr>
                        <tr><td><strong>TTM</strong></td><td>Trailing Twelve Months</td><td>The sum of the last 4 quarters. "TTM Revenue" = total revenue from the most recent 12 months.</td></tr>
                        <tr><td><strong>GAAP</strong></td><td>Generally Accepted Accounting Principles</td><td>Standard accounting rules. "GAAP EPS" follows official rules. "Non-GAAP EPS" excludes one-time charges — usually looks better (be skeptical).</td></tr>
                    </table>
                    <div class="learn-example">Example: NVDA has P/E: 60, EPS: $2.13, FWD P/E: 30. The forward P/E is half the trailing P/E — this means analysts expect earnings to DOUBLE next year. That's why the "high" P/E might actually be reasonable for a fast grower.</div>`},

                {title: 'Short Selling & Squeeze Abbreviations', body: `<h4>Terms for Betting Against Stocks — and What Happens When It Goes Wrong</h4>
                    <table class="learn-table">
                        <tr><th>Abbr.</th><th>Full Form</th><th>What It Means in Plain English</th></tr>
                        <tr><td><strong>SI</strong></td><td>Short Interest</td><td>Total number of shares currently sold short (borrowed and sold, not yet bought back). High SI = lots of people betting the stock will fall.</td></tr>
                        <tr><td><strong>SI%</strong></td><td>Short Interest % of Float</td><td>Short Interest ÷ Float × 100. Above 20% is considered heavily shorted. Above 40% is extreme — squeeze territory.</td></tr>
                        <tr><td><strong>DTC</strong></td><td>Days to Cover</td><td>Short Interest ÷ Average Daily Volume. If DTC = 5, it would take 5 days of normal volume for ALL shorts to buy back. Higher = harder for shorts to escape = more squeeze potential.</td></tr>
                        <tr><td><strong>SIR</strong></td><td>Short Interest Ratio</td><td>Same as Days to Cover (DTC). Sometimes called "short ratio" on financial sites.</td></tr>
                        <tr><td><strong>CTB</strong></td><td>Cost to Borrow</td><td>The annual interest rate shorts pay to borrow shares. Normal is 0.5-2%. High CTB (20-100%+) means shares are hard to find — squeeze building.</td></tr>
                        <tr><td><strong>HTB</strong></td><td>Hard to Borrow</td><td>When a stock has limited shares available for shorting. Your broker flags these as HTB. It means short interest is already high.</td></tr>
                        <tr><td><strong>SSR</strong></td><td>Short Sale Restriction</td><td>When a stock drops 10%+ in a day, the SEC triggers SSR. For the rest of that day and next day, shorts can only sell on an uptick (price going up), making it harder to pile on.</td></tr>
                        <tr><td><strong>FTD</strong></td><td>Failure to Deliver</td><td>When someone sells shares but doesn't actually deliver them within the settlement period. High FTDs can indicate naked shorting (selling shares you haven't even borrowed).</td></tr>
                        <tr><td><strong>SQUEEZE</strong></td><td>Short Squeeze</td><td>When a heavily shorted stock rises, forcing shorts to buy back (cover) to limit losses, which pushes the price even higher in a vicious cycle. Can cause 50-500%+ spikes.</td></tr>
                        <tr><td><strong>COVER</strong></td><td>Short Covering</td><td>When a short seller buys back shares to close their position. Covering = buying = upward pressure on price.</td></tr>
                        <tr><td><strong>MARGIN CALL</strong></td><td>Margin Call</td><td>When your broker demands you deposit more cash because your losses are too high. If you can't pay, they force-close your positions.</td></tr>
                    </table>
                    <div class="learn-warning">⚠ The Short Squeeze tab on this terminal scores stocks on ALL these factors. A high score means multiple squeeze signals are firing simultaneously — but remember, squeezes are rare and dangerous. Most heavily shorted stocks are shorted for good reasons.</div>`},

                {title: 'Order Types & Execution', body: `<h4>How You Tell Your Broker to Buy or Sell</h4>
                    <table class="learn-table">
                        <tr><th>Abbr.</th><th>Full Form</th><th>What It Means in Plain English</th></tr>
                        <tr><td><strong>MKT</strong></td><td>Market Order</td><td>Buy/sell immediately at the best available price. Fastest execution but you don't control the exact price. Use for liquid stocks where speed matters more than price.</td></tr>
                        <tr><td><strong>LMT</strong></td><td>Limit Order</td><td>Buy/sell only at your specified price or better. You control the price but the order might not fill if the stock doesn't reach your price.</td></tr>
                        <tr><td><strong>STP / SL</strong></td><td>Stop Loss Order</td><td>Automatically sells when price drops to your level. Protects you from big losses. Example: Buy at $100, set SL at $95 — you max out at a 5% loss.</td></tr>
                        <tr><td><strong>STP-LMT</strong></td><td>Stop-Limit Order</td><td>Combines stop and limit. Triggers at stop price, but only fills at limit price or better. More precise but might not fill in a fast crash.</td></tr>
                        <tr><td><strong>TRAIL</strong></td><td>Trailing Stop</td><td>A stop loss that moves WITH the price. Set a $2 trail: if stock goes from $100 to $110, your stop moves from $98 to $108. Locks in profits while riding the trend.</td></tr>
                        <tr><td><strong>GTC</strong></td><td>Good Till Cancelled</td><td>Your order stays open until it fills or you cancel it (usually max 60-90 days). Without GTC, orders cancel at end of day.</td></tr>
                        <tr><td><strong>DAY</strong></td><td>Day Order</td><td>Order automatically cancels if not filled by market close. This is the default for most orders.</td></tr>
                        <tr><td><strong>IOC</strong></td><td>Immediate or Cancel</td><td>Fill as much as possible right now, cancel the rest. For when you want partial fills but won't wait.</td></tr>
                        <tr><td><strong>AON</strong></td><td>All or None</td><td>Either fill the ENTIRE order or don't fill any of it. Use when you need exactly your specified quantity.</td></tr>
                        <tr><td><strong>MOO</strong></td><td>Market on Open</td><td>Execute at the opening price. Placed before market opens.</td></tr>
                        <tr><td><strong>MOC</strong></td><td>Market on Close</td><td>Execute at the closing price. Must be placed before 3:45 PM ET.</td></tr>
                        <tr><td><strong>OCO</strong></td><td>One Cancels Other</td><td>Two orders linked together — when one fills, the other auto-cancels. Example: set a profit target AND a stop loss; whichever hits first cancels the other.</td></tr>
                        <tr><td><strong>OTO</strong></td><td>One Triggers Other</td><td>When one order fills, it automatically places another order. Example: buy AAPL at $180 → automatically place a stop loss at $175.</td></tr>
                    </table>
                    <div class="learn-example">Example of a complete trade setup: Buy 100 TSLA with LMT at $250 (GTC). Once filled, place OCO: target at $275 (LMT sell) and stop at $240 (STP sell). You've defined your entry, target, and max loss before the trade even starts.</div>`},

                {title: 'Technical Analysis Abbreviations', body: `<h4>Chart Patterns and Indicator Short Forms</h4>
                    <table class="learn-table">
                        <tr><th>Abbr.</th><th>Full Form</th><th>What It Means in Plain English</th></tr>
                        <tr><td><strong>MA</strong></td><td>Moving Average</td><td>Average price over a period (e.g., 50-day MA). Smooths out noise. Price above MA = uptrend, below = downtrend.</td></tr>
                        <tr><td><strong>SMA</strong></td><td>Simple Moving Average</td><td>Plain average of last N closing prices. SMA(50) = average of last 50 days' closes. Common ones: 20, 50, 100, 200-day.</td></tr>
                        <tr><td><strong>EMA</strong></td><td>Exponential Moving Average</td><td>Like SMA but gives more weight to recent prices. Reacts faster to changes. Day traders prefer EMA over SMA.</td></tr>
                        <tr><td><strong>RSI</strong></td><td>Relative Strength Index</td><td>Oscillator from 0-100. Above 70 = overbought (might drop), below 30 = oversold (might bounce). NOT the same as "relative strength" vs the market.</td></tr>
                        <tr><td><strong>MACD</strong></td><td>Moving Average Convergence Divergence</td><td>Shows momentum direction. When MACD line crosses above signal line = bullish. Below = bearish. The histogram shows the difference between them.</td></tr>
                        <tr><td><strong>BB</strong></td><td>Bollinger Bands</td><td>A band around the price (usually 2 standard deviations from 20-day SMA). Price hitting upper band = stretched high, lower band = stretched low.</td></tr>
                        <tr><td><strong>ATR</strong></td><td>Average True Range</td><td>Measures how much a stock moves per day on average. ATR of $5 means it typically swings $5/day. Use for setting stop losses at 1-2x ATR.</td></tr>
                        <tr><td><strong>S/R</strong></td><td>Support / Resistance</td><td>Support = price floor where buyers step in. Resistance = ceiling where sellers appear. These are the most basic and important chart levels.</td></tr>
                        <tr><td><strong>HOD / LOD</strong></td><td>High of Day / Low of Day</td><td>Today's highest and lowest prices. Breaking HOD = bullish signal for day traders. Breaking LOD = bearish.</td></tr>
                        <tr><td><strong>52W H/L</strong></td><td>52-Week High / Low</td><td>Highest and lowest price in the past year. Breaking 52W high = very bullish (new territory). Near 52W low = potentially cheap or still falling.</td></tr>
                        <tr><td><strong>GAP</strong></td><td>Gap Up / Gap Down</td><td>When a stock opens significantly higher (gap up) or lower (gap down) than yesterday's close. Usually caused by overnight news or earnings.</td></tr>
                        <tr><td><strong>DOJI</strong></td><td>Doji Candle</td><td>A candlestick where open ≈ close (tiny body, long wicks). Signals indecision — neither buyers nor sellers won. Often appears at trend reversals.</td></tr>
                        <tr><td><strong>B/O</strong></td><td>Breakout</td><td>When price moves above resistance on high volume. Often signals the start of a new uptrend. False breakouts (no volume) are traps.</td></tr>
                        <tr><td><strong>B/D</strong></td><td>Breakdown</td><td>When price drops below support. The bearish version of a breakout. Often accelerates selling.</td></tr>
                    </table>
                    <div class="learn-example">Example: "TSLA broke out above $250 resistance on 3x RVOL with RSI at 65 and MACD crossing bullish. SL at 1.5x ATR below entry." Translation: Tesla surged past $250 on heavy volume with momentum indicators confirming the move. Stop loss placed using volatility measurement.</div>`},

                {title: 'Market & Index Abbreviations', body: `<h4>Where Stocks Trade and How Markets Are Measured</h4>
                    <table class="learn-table">
                        <tr><th>Abbr.</th><th>Full Form</th><th>What It Means in Plain English</th></tr>
                        <tr><td><strong>NYSE</strong></td><td>New York Stock Exchange</td><td>The largest stock exchange in the world. Located on Wall Street. Trades the biggest companies (blue chips). Uses a hybrid system with floor traders + electronic.</td></tr>
                        <tr><td><strong>NASDAQ</strong></td><td>National Association of Securities Dealers Automated Quotations</td><td>Second-largest exchange, fully electronic (no trading floor). Known for tech stocks. Home to AAPL, MSFT, AMZN, GOOGL, META, NVDA.</td></tr>
                        <tr><td><strong>S&P 500</strong></td><td>Standard & Poor's 500</td><td>Index of 500 large US companies. THE benchmark for "the market." When people say "the market is up 1%" they usually mean the S&P 500.</td></tr>
                        <tr><td><strong>DJI / DJIA</strong></td><td>Dow Jones Industrial Average</td><td>Index of 30 major US companies. The oldest index (since 1896). Price-weighted (not market-cap-weighted like S&P), so high-priced stocks have more influence.</td></tr>
                        <tr><td><strong>QQQ</strong></td><td>Invesco QQQ Trust (NASDAQ-100 ETF)</td><td>ETF tracking the top 100 NASDAQ stocks. Heavily tech-weighted. When people say "the tech market" they often reference QQQ/NASDAQ.</td></tr>
                        <tr><td><strong>RUT / IWM</strong></td><td>Russell 2000 / iShares Russell 2000 ETF</td><td>Index of 2000 small-cap US stocks. Indicator of domestic economic health since small companies are more US-focused.</td></tr>
                        <tr><td><strong>VIX</strong></td><td>CBOE Volatility Index</td><td>Measures expected S&P 500 volatility over 30 days. Called the "Fear Index." VIX &lt;15 = calm, 15-25 = normal, 25-35 = nervous, 35+ = panic.</td></tr>
                        <tr><td><strong>SPY</strong></td><td>SPDR S&P 500 ETF Trust</td><td>Most traded ETF in the world. Tracks the S&P 500. When traders say "SPY" they often mean the market direction.</td></tr>
                        <tr><td><strong>ETF</strong></td><td>Exchange-Traded Fund</td><td>A basket of stocks you can trade like a single stock. SPY = 500 stocks in one trade. XLK = tech sector. QQQ = NASDAQ 100. Cheap diversification.</td></tr>
                        <tr><td><strong>IPO</strong></td><td>Initial Public Offering</td><td>When a private company first sells shares to the public. Often volatile in the first days/weeks. Lock-up expiry (90-180 days later) can cause sell-offs.</td></tr>
                        <tr><td><strong>SEC</strong></td><td>Securities and Exchange Commission</td><td>The US government agency that regulates the stock market. Enforces rules against fraud, insider trading, and market manipulation.</td></tr>
                        <tr><td><strong>FINRA</strong></td><td>Financial Industry Regulatory Authority</td><td>Self-regulatory body for broker-dealers. Enforces rules like PDT. Your broker reports to FINRA.</td></tr>
                        <tr><td><strong>FOMC</strong></td><td>Federal Open Market Committee</td><td>Part of the Federal Reserve that sets interest rates. FOMC meetings (8x/year) are the most market-moving events. Rate hikes = bearish, cuts = bullish.</td></tr>
                    </table>`},

                {title: 'Trading Slang & Trader Lingo', body: `<h4>Common Terms You'll Hear Traders Use</h4>
                    <table class="learn-table">
                        <tr><th>Term</th><th>What It Means</th></tr>
                        <tr><td><strong>BULL / BEAR</strong></td><td>Bull = optimistic (prices going up). Bear = pessimistic (prices going down). "I'm bullish on NVDA" = I think NVDA will go up.</td></tr>
                        <tr><td><strong>LONG / SHORT</strong></td><td>Long = you bought shares expecting price to rise. Short = you borrowed and sold shares expecting price to fall.</td></tr>
                        <tr><td><strong>BAG HOLDER</strong></td><td>Someone stuck holding a losing stock that's dropped significantly. They're "holding the bag."</td></tr>
                        <tr><td><strong>DIAMOND HANDS</strong></td><td>Holding through extreme volatility without selling. Originally from Reddit/WallStreetBets culture.</td></tr>
                        <tr><td><strong>PAPER HANDS</strong></td><td>Selling at the first sign of a dip. The opposite of diamond hands.</td></tr>
                        <tr><td><strong>DIP</strong></td><td>A temporary price decline. "Buy the dip" = buy when price drops, expecting a bounce. Risky because dips can become crashes.</td></tr>
                        <tr><td><strong>FOMO</strong></td><td>Fear Of Missing Out. Buying after a big move because you're afraid of missing more gains. Usually leads to buying at the top.</td></tr>
                        <tr><td><strong>FUD</strong></td><td>Fear, Uncertainty, Doubt. Negative sentiment or misinformation that drives prices down.</td></tr>
                        <tr><td><strong>DD</strong></td><td>Due Diligence. Research you do before trading a stock — reading financials, checking charts, understanding the business.</td></tr>
                        <tr><td><strong>YOLO</strong></td><td>You Only Live Once. Putting a large risky bet on a single stock. Almost always a bad idea.</td></tr>
                        <tr><td><strong>SCALP</strong></td><td>A very short-term trade (seconds to minutes) aiming for small profits. Scalpers make many trades per day with tiny targets.</td></tr>
                        <tr><td><strong>SWING</strong></td><td>Swing Trade — holding a stock for days to weeks to capture a price "swing." Less stressful than day trading.</td></tr>
                        <tr><td><strong>PT</strong></td><td>Price Target. The price you expect a stock to reach. "My PT on AAPL is $200" means you think it'll hit $200.</td></tr>
                        <tr><td><strong>R:R</strong></td><td>Risk-to-Reward Ratio. If you risk $1 to make $3, your R:R is 1:3. Never take a trade worse than 1:2.</td></tr>
                        <tr><td><strong>GREEN / RED</strong></td><td>Green = stock is up today. Red = stock is down. "My portfolio is all green" = everything is up.</td></tr>
                        <tr><td><strong>MOON</strong></td><td>"Going to the moon" = stock is skyrocketing. Usually used in meme-stock communities.</td></tr>
                        <tr><td><strong>DEAD CAT BOUNCE</strong></td><td>A brief price recovery during a major decline. The stock bounces but then continues falling. Named because "even a dead cat bounces if dropped from high enough."</td></tr>
                        <tr><td><strong>CATCHING A KNIFE</strong></td><td>Buying a rapidly falling stock hoping for a bounce. Extremely risky — the stock might keep falling.</td></tr>
                        <tr><td><strong>WHALE</strong></td><td>A trader or institution with very large positions that can move the market. When a whale buys or sells, price moves.</td></tr>
                    </table>
                    <div class="learn-warning">⚠ Trading slang and memes are fun but can lead to bad decisions. FOMO and YOLO are the two biggest account killers. Stick to your plan, follow your risk rules, and don't let social media pressure drive your trades.</div>`},

                {title: 'Options Trading Abbreviations', body: `<h4>Terms for Trading Options Contracts (Advanced)</h4>
                    <table class="learn-table">
                        <tr><th>Abbr.</th><th>Full Form</th><th>What It Means in Plain English</th></tr>
                        <tr><td><strong>CALL</strong></td><td>Call Option</td><td>The right (not obligation) to BUY 100 shares at a specific price by a specific date. You buy calls when you think the stock will go UP.</td></tr>
                        <tr><td><strong>PUT</strong></td><td>Put Option</td><td>The right (not obligation) to SELL 100 shares at a specific price by a specific date. You buy puts when you think the stock will go DOWN.</td></tr>
                        <tr><td><strong>STRIKE</strong></td><td>Strike Price</td><td>The price at which you can buy (call) or sell (put) the stock. A $200 call on AAPL lets you buy AAPL at $200 regardless of market price.</td></tr>
                        <tr><td><strong>EXP</strong></td><td>Expiration Date</td><td>The last day the option is valid. After this date, it's worthless. Options lose value as expiration approaches (time decay).</td></tr>
                        <tr><td><strong>ITM</strong></td><td>In The Money</td><td>A call is ITM when stock price > strike price. A put is ITM when stock price < strike price. ITM options have "intrinsic value."</td></tr>
                        <tr><td><strong>OTM</strong></td><td>Out of The Money</td><td>A call is OTM when stock price < strike. A put is OTM when stock price > strike. OTM options are cheaper but riskier — they expire worthless if stock doesn't move enough.</td></tr>
                        <tr><td><strong>ATM</strong></td><td>At The Money</td><td>When the stock price ≈ strike price. ATM options have the highest time value and are most sensitive to price changes.</td></tr>
                        <tr><td><strong>IV</strong></td><td>Implied Volatility</td><td>How much the market expects the stock to move. High IV = expensive options (before earnings, news). Low IV = cheap options (quiet periods).</td></tr>
                        <tr><td><strong>THETA</strong></td><td>Theta (Time Decay)</td><td>How much value an option loses per day just from time passing. A theta of -$5 means the option loses $5/day if nothing else changes.</td></tr>
                        <tr><td><strong>DELTA</strong></td><td>Delta</td><td>How much the option price moves per $1 move in the stock. Delta 0.50 means the option moves $0.50 for every $1 the stock moves.</td></tr>
                        <tr><td><strong>GAMMA</strong></td><td>Gamma</td><td>How much delta changes per $1 move. High gamma = option's sensitivity changes quickly. Most relevant near expiration.</td></tr>
                        <tr><td><strong>VEGA</strong></td><td>Vega</td><td>How much the option price changes per 1% change in IV. High vega = very sensitive to volatility changes (earnings plays).</td></tr>
                        <tr><td><strong>OI</strong></td><td>Open Interest</td><td>Total number of outstanding option contracts. High OI = liquid option with tight spreads. Low OI = harder to trade.</td></tr>
                        <tr><td><strong>PREM</strong></td><td>Premium</td><td>The price you pay to buy an option. For a $5 premium on a call, you pay $500 (since each contract = 100 shares).</td></tr>
                        <tr><td><strong>GEX</strong></td><td>Gamma Exposure</td><td>Net gamma of all options at different strikes. Positive GEX = market makers dampen volatility. Negative GEX = market makers amplify moves.</td></tr>
                    </table>
                    <div class="learn-example">Example: "AAPL 200C 1/17 EXP, $5.00 PREM, Delta 0.45, IV 28%" — This is a call option to buy AAPL at $200, expiring Jan 17, costing $500 per contract. It moves ~$0.45 for every $1 AAPL moves, and implied volatility is 28%.</div>
                    <div class="learn-warning">⚠ Options are leveraged instruments — you can lose 100% of your investment very quickly. Never trade options until you fully understand all the Greeks (Delta, Gamma, Theta, Vega) and how time decay works.</div>`}
            ])}

            ${this._learnLevel('EXPERT', 'expert', [
                {title: 'Day Trading Rules & PDT', body: `<h4>Pattern Day Trader Rule (PDT)</h4>
                    <p>If you make 4+ day trades in 5 business days using a margin account, you're classified as a Pattern Day Trader and must maintain $25,000 minimum equity.</p>
                    <h4>What Counts as a Day Trade</h4>
                    <p>Buying AND selling (or shorting AND covering) the same security on the same day.</p>
                    <div class="learn-example">Example: Buy AAPL at 10am, sell AAPL at 2pm = 1 day trade. Buy AAPL today, sell tomorrow = NOT a day trade.</div>
                    <h4>Ways Around PDT</h4>
                    <table class="learn-table">
                        <tr><th>Method</th><th>Pros</th><th>Cons</th></tr>
                        <tr><td>Cash account</td><td>No PDT rule</td><td>Must wait for settlement (T+1)</td></tr>
                        <tr><td>Keep $25K+</td><td>Unlimited day trades</td><td>High capital requirement</td></tr>
                        <tr><td>Swing trade</td><td>No restrictions</td><td>Overnight risk</td></tr>
                    </table>`},
                {title: 'Day Trading Checklist', body: `<h4>Before Market Open</h4>
                    <ol class="learn-steps">
                        <li>Check pre-market movers (use this terminal's screener)</li>
                        <li>Review economic calendar for major events</li>
                        <li>Check futures (S&P, NASDAQ) for market direction</li>
                        <li>Identify your watchlist — max 5-8 stocks</li>
                        <li>Set price alerts for key levels (use A key)</li>
                    </ol>
                    <h4>Entry Checklist (Before Every Trade)</h4>
                    <ol class="learn-steps">
                        <li>Is volume above average? (Vol Ratio > 1.5x)</li>
                        <li>Is there a clear catalyst? (news, earnings, squeeze)</li>
                        <li>What's your entry price?</li>
                        <li>What's your stop loss? (max 2% of account)</li>
                        <li>What's your target? (min 2:1 reward-to-risk)</li>
                        <li>Is the overall market supporting your direction?</li>
                    </ol>
                    <div class="learn-warning">⚠ Never trade without a stop loss. Never risk more than 1-2% of your account on a single trade. The goal is to survive long enough to profit.</div>`},
                {title: 'Risk Management', body: `<h4>The 1% Rule</h4>
                    <p>Never risk more than 1% of your total account on a single trade.</p>
                    <div class="learn-example">Example: $10,000 account → max risk per trade = $100. If your stop loss is $1 away from entry, position size = 100 shares.</div>
                    <h4>Position Sizing Formula</h4>
                    <p>Shares = (Account × Risk%) ÷ (Entry Price − Stop Loss Price)</p>
                    <h4>Risk Management Rules</h4>
                    <ol class="learn-steps">
                        <li>Always set a stop loss BEFORE entering</li>
                        <li>Never move a stop loss further from entry</li>
                        <li>Take partial profits at 1:1 ratio</li>
                        <li>Trail remaining position with a moving stop</li>
                        <li>Max daily loss: 3% of account — then STOP trading</li>
                        <li>Max weekly loss: 6% — take a break and review</li>
                    </ol>
                    <div class="learn-warning">⚠ 90% of day traders lose money. The 10% who survive follow strict risk management. It's not about being right — it's about managing when you're wrong.</div>`},
                {title: 'Using This Terminal', body: `<h4>Keyboard Shortcuts</h4>
                    <table class="learn-table">
                        <tr><th>Key</th><th>Action</th></tr>
                        <tr><td>/</td><td>Search for any ticker</td></tr>
                        <tr><td>W</td><td>Add ticker to watchlist</td></tr>
                        <tr><td>A</td><td>Set price alert</td></tr>
                        <tr><td>R</td><td>Refresh all data</td></tr>
                        <tr><td>1–7</td><td>Switch between tabs</td></tr>
                        <tr><td>Esc</td><td>Close panels/search</td></tr>
                    </table>
                    <h4>Recommended Workflow</h4>
                    <ol class="learn-steps">
                        <li>Check market overview (top bar) — are indices up or down?</li>
                        <li>Review sector performance — which sectors are leading?</li>
                        <li>Scan Most Volatile (tab 2) for movers</li>
                        <li>Check Most Active (tab 3) for high-volume plays</li>
                        <li>Review Short Squeeze (tab 6) for potential squeeze setups</li>
                        <li>Click any stock to see full details, chart, fundamentals</li>
                        <li>Add promising stocks to your watchlist (W key)</li>
                        <li>Set price alerts (A key) for entry/exit levels</li>
                    </ol>`}
            ])}
        </div>`;
    },

    _learnLevel(title, cls, topics) {
        let html = `<div class="learn-level">
            <div class="learn-level-title">
                <span class="learn-level-badge ${cls}">${cls.toUpperCase()}</span>
                <span class="learn-level-name">${title}</span>
            </div>`;
        topics.forEach((t, i) => {
            const id = cls + "-" + i;
            html += `<div class="learn-topic" id="topic-${id}">
                <div class="learn-topic-header" onclick="document.getElementById('topic-${id}').classList.toggle('open')">
                    <span>${t.title}</span>
                    <span class="arrow">▶</span>
                </div>
                <div class="learn-topic-body">${t.body}</div>
            </div>`;
        });
        html += `</div>`;
        return html;
    },

    _buildTable(data, cols) {
        let html = '<table class="stock-table"><thead><tr>';
        cols.forEach(c => { html += `<th>${c.label}</th>`; });
        html += '</tr></thead><tbody>';
        data.forEach(row => {
            html += `<tr onclick="App.showDetail('${row.ticker}')">`;
            cols.forEach(c => {
                const val = row[c.key];
                html += `<td>${c.fmt ? c.fmt(val) : val}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody></table>';
        if (!data.length) html += '<div class="loading">NO DATA AVAILABLE</div>';
        return html;
    }
};
