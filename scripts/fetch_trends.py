import os
from pytrends.request import TrendReq
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

supabase = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_SERVICE_ROLE_KEY"))

def main():
    pytrends = TrendReq(hl='en-US', tz=360)
    
    # 1. Fetch unprocessed keywords entered by users via the Frontend
    res = supabase.table("query_queue").select("*").eq("is_processed", False).execute()
    keywords = [item['keyword'] for item in res.data]

    if not keywords:
        print("No new queries to process.")
        return

    print(f"Processing trends for: {keywords}")
    
    # 2. Get Trends for Pakistan
    pytrends.build_payload(keywords, timeframe='now 7-d', geo='PK')
    data = pytrends.interest_by_region(resolution='CITY', inc_low_vol=True)
    
    for kw in keywords:
        if kw in data.columns:
            for city, row in data.iterrows():
                if row[kw] > 0:
                    payload = {
                        "category": "Generic Search", # This can be AI-categorized later
                        "product_name": kw,
                        "region": city,
                        "trend_score": int(row[kw]),
                        "source": "Google Trends"
                    }
                    supabase.table("market_insights").insert(payload).execute()
        
        # 3. Mark as processed so we don't fetch it again
        supabase.table("query_queue").update({"is_processed": True}).eq("keyword", kw).execute()

    print("Generic Sync Complete!")

if __name__ == "__main__":
    main()
