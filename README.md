Got it — you want to replicate the **Messari dashboard** style, and map each of its components to the relevant **CoinDesk API endpoints**. Let’s break it down section by section:

---

### 1. **Live Prices & Charts (Messari “Prices & Chart”)**
- **Messari shows:** Current price, % change (1D, 1W, 1M, etc.), and interactive charts.  
- **CoinDesk APIs:**  
  - `/index/cc/v1/latest/tick` → latest tick (real‑time price + OHLC).  
  - `/index/cc/v1/historical/days` → daily OHLCV+ for time‑series (1D, 1W, 1M).  
  - `/index/cc/v1/historical/hours` → hourly OHLCV+ for intraday charts.  
  - `/index/cc/v1/historical/minutes` → minute‑level OHLCV+ for short‑term charts.  

---

### 2. **Top Assets Table (Messari “Top 100”)**
- **Messari shows:** List of assets with price, market cap, volume, % change.  
- **CoinDesk APIs:**  
  - `/index/cc/v2/markets` → metadata about indices and instruments.  
  - `/index/cc/v1/markets/instruments` → mapped instruments (BTC‑USD, ETH‑USD, etc.).  
  - Combine with `/index/cc/v1/latest/tick` for live price + volume + OHLC.  
  - `/index/cc/v1/historical/days` for historical % change calculations.

---

### 3. **Market Cap & Volume Charts**
- **Messari shows:** Aggregate market cap and volume trends.  
- **CoinDesk APIs:**  
  - `/index/cc/v1/historical/days` (OHLCV includes volume).  
  - `/index/cc/v1/historical/hours` for intraday volume trends.  
  - Aggregate across instruments to replicate total market cap.

---

### 4. **Research & Reports**
- **Messari shows:** Articles, insights, datasets.  
- **CoinDesk APIs:**  
  - CoinDesk doesn’t expose “research reports” via API.  
  - You’d need to integrate CoinDesk **News API** or external feeds for this part.

---

### 5. **Fundraising / Token Unlocks**
- **Messari shows:** Fundraising rounds, unlock schedules.  
- **CoinDesk APIs:**  
  - Not directly available in CoinDesk’s API.  
  - You’d need external datasets (Messari proprietary). CoinDesk focuses on **pricing, indices, and market data**, not tokenomics events.

---

### 6. **Watchlists / Screener**
- **Messari shows:** Custom asset lists with filters.  
- **CoinDesk APIs:**  
  - `/index/cc/v1/markets/instruments` → discover instruments.  
  - Combine with `/index/cc/v1/latest/tick` + historical endpoints to build filters (e.g., “Top gainers 1W”).

---

### 7. **Signals / Intel**
- **Messari shows:** AI signals, alerts, sentiment.  
- **CoinDesk APIs:**  
  - Not directly supported. CoinDesk provides **indices, OHLCV, and metadata**, but not AI signals.  
  - You’d need to build your own analytics layer on top of CoinDesk data.

---

✅ **Summary:**  
To replicate Messari’s **core pricing & charting components**, the most important CoinDesk endpoints are:
- `/index/cc/v1/latest/tick` (real‑time prices)  
- `/index/cc/v1/historical/days|hours|minutes` (time‑series OHLCV)  
- `/index/cc/v1/markets/instruments` (asset discovery)  
- `/index/cc/v2/markets` (index metadata)

Other Messari features like **fundraising, unlocks, research reports, signals** are *not covered* by CoinDesk’s API — you’d need external sources or your own enrichment layer.

---

Would you like me to sketch a **component‑to‑endpoint mapping table** (Messari UI → CoinDesk API) so you can see exactly how each part of the dashboard would be wired? That would give you a blueprint for building the replica.