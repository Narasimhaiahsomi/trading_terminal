const Charts = {
    drawSparkline(canvas, data, color) {
        if (!canvas || !data || data.length < 2) return;
        const ctx = canvas.getContext("2d");
        const w = canvas.width = canvas.offsetWidth * 2;
        const h = canvas.height = canvas.offsetHeight * 2;
        ctx.scale(2, 2);
        const dw = canvas.offsetWidth, dh = canvas.offsetHeight;
        ctx.clearRect(0, 0, dw, dh);
        const min = Math.min(...data), max = Math.max(...data);
        const range = max - min || 1;
        const step = dw / (data.length - 1);
        ctx.beginPath();
        data.forEach((v, i) => {
            const x = i * step;
            const y = dh - ((v - min) / range) * (dh - 4) - 2;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.strokeStyle = color || "#ff8c00";
        ctx.lineWidth = 1.5;
        ctx.stroke();
    },

    drawLineChart(canvas, data, options = {}) {
        if (!canvas || !data || data.length < 2) return;
        const ctx = canvas.getContext("2d");
        const w = canvas.width = canvas.offsetWidth * 2;
        const h = canvas.height = canvas.offsetHeight * 2;
        ctx.scale(2, 2);
        const dw = canvas.offsetWidth, dh = canvas.offsetHeight;
        ctx.clearRect(0, 0, dw, dh);

        const pad = { top: 10, right: 10, bottom: 25, left: 55 };
        const cw = dw - pad.left - pad.right;
        const ch = dh - pad.top - pad.bottom;

        const prices = data.map(d => d.close || d.price || d);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const range = max - min || 1;

        ctx.strokeStyle = "#222";
        ctx.lineWidth = 0.5;
        ctx.fillStyle = "#666";
        ctx.font = "10px JetBrains Mono, monospace";
        ctx.textAlign = "right";
        for (let i = 0; i <= 4; i++) {
            const y = pad.top + (ch / 4) * i;
            const val = max - (range / 4) * i;
            ctx.beginPath();
            ctx.moveTo(pad.left, y);
            ctx.lineTo(dw - pad.right, y);
            ctx.stroke();
            ctx.fillText(val.toFixed(2), pad.left - 5, y + 3);
        }

        const step = cw / (prices.length - 1);
        ctx.beginPath();
        prices.forEach((v, i) => {
            const x = pad.left + i * step;
            const y = pad.top + ch - ((v - min) / range) * ch;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        const color = options.color || (prices[prices.length - 1] >= prices[0] ? "#00c853" : "#ff1744");
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
        grad.addColorStop(0, color + "30");
        grad.addColorStop(1, color + "00");
        ctx.lineTo(pad.left + (prices.length - 1) * step, pad.top + ch);
        ctx.lineTo(pad.left, pad.top + ch);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        if (data[0] && data[0].date) {
            ctx.fillStyle = "#666";
            ctx.textAlign = "center";
            ctx.font = "9px JetBrains Mono, monospace";
            const labelCount = Math.min(5, data.length);
            const labelStep = Math.floor(data.length / labelCount);
            for (let i = 0; i < data.length; i += labelStep) {
                const x = pad.left + i * step;
                const label = data[i].date.slice(5);
                ctx.fillText(label, x, dh - 5);
            }
        }
    }
};
