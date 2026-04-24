# MarketPulse AI Dashboard

Market Intelligence Dashboard for Pakistan Market Trends and AI-powered strategy generation.

## 🚀 Setup Instructions

### 1. Environment Variables

You need to configure the following environment variables.

#### For the Web Application (Vercel / Cloud Run)

Add these to your deployment environment (e.g., Vercel Project Settings > Environment Variables):

- `VITE_SUPABASE_URL`: Your Supabase Project URL (e.g., `https://xyz.supabase.co`)
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Anonymous API Key.
- `GEMINI_API_KEY`: Your Google AI Studio API Key (for the Strategy Report).

#### For the Python Scraper (GitHub Actions)

Add these as **Repository Secrets** in GitHub (Settings > Secrets and variables > Actions):

- `SUPABASE_URL`: Your Supabase Project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (required for writing to the database skipping RLS if needed).
- `GEMINI_API_KEY`: (Optional, if the scraper uses AI for pre-processing).

### 2. Database Schema

Ensure your Supabase project has the following tables:

#### `query_queue`
- `id`: `uuid` (primary key, default: `gen_random_uuid()`)
- `keyword`: `text` (not null)
- `is_processed`: `boolean` (default: `false`)
- `created_at`: `timestamp with time zone` (default: `now()`)

#### `market_insights`
- `id`: `uuid` (primary key, default: `gen_random_uuid()`)
- `category`: `text`
- `product_name`: `text` (not null)
- `region`: `text` (e.g., Karachi, Lahore, Islamabad)
- `trend_score`: `integer` (0-100)
- `source`: `text` (e.g., Google Trends, Daraz, Local Retail)
- `created_at`: `timestamp with time zone` (default: `now()`)

### 3. Deployment

1. **Frontend:** Deploy to Vercel or any static hosting. The project is built with Vite.
2. **Backend Scraper:** Place the `fetch_trends.py` in `/scripts/` and configure a GitHub Action to run on a schedule or when `query_queue` is modified (via a webhook or trigger).

## 🛠 Tech Stack

- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS + Shadcn/UI
- **Database:** Supabase
- **AI:** Google Gemini API (gemini-3-flash-preview)
- **Visualization:** Recharts
- **PDF Export:** jsPDF
- **Animations:** Motion/React

## 📄 Exporting Reports

Click the **"Export PDF Report"** button on any active dashboard to download a localized market entry strategy optimized for the Pakistan landscape.
