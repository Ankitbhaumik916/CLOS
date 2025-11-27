# CLOS - Cloud Kitchen OS

A modern, AI-powered analytics dashboard for cloud kitchen operations. CLOS provides real-time insights into order performance, profitability analysis, and AI-driven recommendations to optimize your cloud kitchen business.

## Features

✨ **Key Capabilities:**
- 📊 **Dashboard** — Real-time KPIs: total revenue, order count, average ratings
- 📈 **Raw Data Grid** — Inspect full order datasets with filtering and sorting
- 🤖 **AI Deep Dive** — Agentic AI analysis powered by local models (Ollama/phi-3mini) or Google Gemini
  - Demand forecasting & menu optimization
  - Customer insight analysis
  - Profitability breakdown (Zomato commission, net revenue)
  - Actionable recommendations
- 💾 **Persistent Storage** — Uploaded datasets stay saved across sessions using localStorage
- 🔐 **Authentication** — Session-based user login

---

## Quick Start

### Prerequisites

- **Node.js** 16+ and npm
- (Optional) **Ollama** with phi-3mini model for local AI analysis
  - Download Ollama: https://ollama.ai
  - Pull model: `ollama pull phi-3mini`
  - Default endpoint: `http://127.0.0.1:11434`

### Installation

```bash
cd CLOS
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is busy).

### Environment Variables

Create a `.env` file in the `CLOS/` folder (optional):

```env
# Google Gemini API key (optional; used if local AI unavailable)
API_KEY=your_google_genai_api_key_here
```

---

## Usage

### 1. Login
- Use any username (e.g., "Chef Ravi")
- Session is stored locally and persists on reload

### 2. Upload Data
- Click **"Import CSV"** to upload a Zomato CSV export
- Data is automatically saved to localStorage
- Reopen the app anytime—your data persists without re-uploading

### 3. Dashboard Tab
- View key metrics: gross revenue, order count, average rating, days since last upload
- One-glance health check of your kitchen

### 4. Raw Data Tab
- Explore full order records in a sortable, filterable grid
- Inspect order details, items, ratings, and timestamps

### 5. AI Deep Dive Tab
- Click **"Start Analysis"** to generate insights
- The system tries three tiers (in order):
  1. **Local AI** (Ollama/phi-3mini) — Instant, fully offline
  2. **Google Gemini** — If API key is set
  3. **Smart Local Fallback** — Data-driven heuristics, no external APIs
- Results include profitability analysis, customer sentiment, and top 3 action items

### 6. Purge Data
- Click **"Purge DB"** to clear all stored orders and start fresh

---

## Architecture

### Tech Stack
- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Build:** Vite
- **UI Components:** Custom dark-theme design
- **Storage:** Browser localStorage (no backend)
- **AI Integration:** 
  - Local: HTTP calls to Ollama REST API
  - Cloud: Google GenAI SDK

### Project Structure

```
CLOS/
├── App.tsx                      # Main app router & state manager
├── components/
│   ├── Dashboard.tsx            # KPI cards & overview
│   ├── DataGrid.tsx             # Sortable order table
│   ├── GeminiInsight.tsx        # AI analysis UI
│   ├── Login.tsx                # User authentication
│   └── ...
├── services/
│   ├── storageService.ts        # localStorage abstraction (persist orders)
│   ├── agentService.ts          # Local model (Ollama) API client
│   ├── geminiService.ts         # Google Gemini + fallback logic
│   ├── authService.ts           # User session management
│   ├── csvService.ts            # CSV parsing
│   └── ...
├── types.ts                     # TypeScript interfaces (ZomatoOrder, InsightResponse, etc.)
├── index.tsx                    # React entry point
├── index.html                   # HTML template
└── vite.config.ts               # Vite configuration
```

---

## AI Analysis Flow

### Option 1: Local AI (Recommended for Privacy & Speed)

Requires Ollama running locally:

```bash
# Terminal 1: Start Ollama server
ollama serve

# Terminal 2: Pull phi-3mini (one-time)
ollama pull phi-3mini
```

Then upload CSV in the app and click "Start Analysis". The browser will call `http://127.0.0.1:11434/api/generate` directly.

**Advantages:**
- ✅ No internet needed
- ✅ No API keys
- ✅ Instant responses
- ✅ Full data privacy

### Option 2: Google Gemini (Requires API Key)

1. Get a free API key: https://aistudio.google.com
2. Set in `.env`:
   ```env
   API_KEY=your_key_here
   ```
3. Fallback kicks in automatically if local model unavailable

### Option 3: Smart Local Fallback

If neither local nor API models work, the app generates insights using rule-based analysis:
- Top item identification
- Rating-based sentiment
- Profitability calculations
- Growth recommendations

No external calls; always works.

---

## Persistent Storage

Orders are saved to `localStorage` under the key `ck_orders_v1`. This means:
- ✅ Data persists across browser refreshes
- ✅ Data persists across app restarts
- ✅ Works offline
- ⚠️ Stored per browser/domain (not synced across devices)
- ⚠️ Subject to browser storage limits (~5-10MB)

**To clear all data:** Click "Purge DB" button or run in browser console:
```javascript
localStorage.removeItem('ck_orders_v1')
```

---

## CORS & Local Model Setup

If you get CORS errors when calling Ollama, one of these approaches will help:

### Approach 1: Enable CORS in Ollama (if possible)

Some Ollama versions support CORS headers. Check your Ollama docs.

### Approach 2: Use a Local Proxy (Node.js)

Create a simple proxy server to forward requests:

```javascript
// proxy.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/proxy/ollama', async (req, res) => {
  try {
    const response = await axios.post('http://127.0.0.1:11434/api/generate', req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Proxy running on http://localhost:3000'));
```

Then set in browser console:
```javascript
localStorage.setItem('localAi.url', 'http://localhost:3000/proxy/ollama')
```

### Approach 3: Browser Console Override

Change the local AI endpoint in browser DevTools console:
```javascript
localStorage.setItem('localAi.url', 'http://127.0.0.1:11434')
```

---

## CSV Format

Expected Zomato CSV columns:
```
order_id, orderPlacedAt, items, totalAmount, rating, ...
```

Example:
```
ZO12345, 2025-01-15T10:30:00Z, "2x Biryani, 1x Raita", 450, 4.5
ZO12346, 2025-01-15T11:00:00Z, "3x Butter Chicken, 2x Naan", 680, 4.0
```

---

## Development

### Install Dependencies
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## Configuration

### Dark Mode
The app enforces dark mode by default (adds `dark` class to `<html>`).

### Theme Colors
- Primary: `#f97316` (Orange-500)
- Background: `#121212`
- Surface: `#1c1c1e`
- Text: `#fef3c7` (Amber-50)

Modify Tailwind config or inline Tailwind classes to customize.

---

## Troubleshooting

### "Unable to forecast demand without connection"
- Local model not reachable
- Google API key missing or invalid
- **Fix:** Check browser console for errors; verify Ollama is running or set a valid API_KEY

### Data disappears after refresh
- localStorage is browser-specific and domain-specific
- **Fix:** Ensure you're on the same domain/browser; check if private browsing is enabled

### CORS errors
- Local model server doesn't have CORS headers
- **Fix:** See [CORS & Local Model Setup](#cors--local-model-setup) section

### Slow AI analysis
- Local model still warming up
- Large dataset (1000+ orders)
- **Fix:** Wait 10-30 seconds; consider summarizing data before upload

---

## API Reference

### storageService
```typescript
storageService.loadOrders(): ZomatoOrder[]
storageService.saveOrders(newOrders: ZomatoOrder[]): ZomatoOrder[]
storageService.clearOrders(): void
```

### agentService
```typescript
analyzeWithLocalModel(orders: ZomatoOrder[], userName: string): Promise<InsightResponse>
```

### geminiService
```typescript
analyzeKitchenData(orders: ZomatoOrder[], userName: string): Promise<InsightResponse>
// Returns insights from: local model → Google Gemini → smart fallback
```

---

## Future Enhancements

- 🗄️ Backend database (PostgreSQL/MongoDB) for multi-device sync
- 📱 Mobile app (React Native)
- 🔔 Real-time order notifications
- 📊 Export reports (PDF/Excel)
- 🧠 Multi-step agentic loops (plan → execute → refine)
- 🌍 Multi-language support
- 🎯 Inventory management integration

---

## Contributing

Contributions welcome! Fork the repo and submit a pull request.

---

## License

MIT License — see LICENSE file for details.

---

## Support

For issues, questions, or feature requests, open an issue on GitHub: https://github.com/Ankitbhaumik916/CLOS

---

## Author

Built with ❤️ by the Cloud Kitchen OS team.

**Last Updated:** November 28, 2025
