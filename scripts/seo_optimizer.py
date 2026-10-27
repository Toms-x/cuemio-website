# scripts/seo_optimizer.py

import os
import json
import re
import frontmatter
from datetime import datetime, timedelta
from collections import Counter

# NLTK imports
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from textstat.textstat import textstat

# Google API imports
from google.oauth2 import service_account
from googleapiclient.discovery import build
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    RunReportRequest,
    Filter,
    FilterExpression,
)

# google analytics configuration
GSC_SITE_URL = 'sc-domain:cuemio.com'
GA4_PROPERTY_ID = '452739298'

CONTENT_DIR = "src/content/blog"
CONTENT_AUDIT_OUTPUT_FILE = "src/data/seo-reports.json"
LIVE_VITALS_OUTPUT_FILE = "src/data/seo-vitals.json"

# part 1: live SEO vitals from GSC and GA4 API
def get_google_credentials():
    """Builds credentials from the Netlify environment variable."""
    key_file_contents = os.environ.get('GCP_SERVICE_ACCOUNT_KEY')
    if not key_file_contents:
        print("🚨 ERROR: GCP_SERVICE_ACCOUNT_KEY environment variable not found.")
        return None
    
    try:
        info = json.loads(key_file_contents)
        return service_account.Credentials.from_service_account_info(info)
    except Exception as e:
        print(f"🚨 ERROR: Failed to load service account info: {e}")
        return None

def fetch_live_seo_data(credentials):
    """Fetches data from GSC and GA4 APIs."""
    
    # date range (Last 30 days)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    gsc_data = fetch_gsc_data(credentials, GSC_SITE_URL, start_date, end_date)
    ga4_data = fetch_ga4_data(credentials, GA4_PROPERTY_ID, start_date, end_date)
    
    # mocked technical data
    technical_health = {
        "cwv_good_percent": 88,
        "index_valid": 150,
        "index_errors": 5,
    }

    return {
        "last_updated": end_date.isoformat(),
        "performance_kpis": {**ga4_data['performance_kpis'], **gsc_data['performance_kpis']},
        "content_strategy": {**ga4_data['content_strategy'], **gsc_data['content_strategy']},
        "technical_health": technical_health
    }

def fetch_gsc_data(credentials, site_url, start_date, end_date):
    """Fetches Impressions, Clicks, CTR, and Top Keywords from GSC."""
    try:
        gsc_service = build('webmasters', 'v3', credentials=credentials)
        
        request_body = {
            'startDate': start_date.strftime('%Y-%m-%d'),
            'endDate': end_date.strftime('%Y-%m-%d'),
            'dimensions': ['query'],
            'rowLimit': 10
        }
        
        response = gsc_service.searchanalytics().query(
            siteUrl=site_url,
            body=request_body
        ).execute()
        
        rows = response.get('rows', [])
        
        # calculate aggregate totals
        total_impressions = sum(row['impressions'] for row in rows)
        total_clicks = sum(row['clicks'] for row in rows)
        avg_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
        
        top_gaining_keywords = [
            {"keyword": row['keys'][0], "position": round(row['position'], 1), "change": "+0"}
            for row in rows
        ]

        return {
            "performance_kpis": {
                "organic_impressions": f"{total_impressions:,}",
                "avg_ctr": f"{avg_ctr:.1f}%",
            },
            "content_strategy": {
                "top_gaining_keywords": top_gaining_keywords,
            }
        }
    except Exception as e:
        print(f"🚨 ERROR fetching GSC data: {e}")
        return {
            "performance_kpis": {"organic_impressions": "N/A", "avg_ctr": "N/A"},
            "content_strategy": {"top_gaining_keywords": []}
        }

def fetch_ga4_data(credentials, property_id, start_date, end_date):
    """Fetches Organic Traffic and Top Landing Pages from GA4 Data API."""
    try:
        client = BetaAnalyticsDataClient(credentials=credentials)
        
        # request for Organic Sessions and Top Pages
        request = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=[Dimension(name="landingPage")],
            metrics=[Metric(name="sessions")],
            date_ranges=[DateRange(start_date=start_date.strftime('%Y-%m-%d'), end_date=end_date.strftime('%Y-%m-%d'))],
            dimension_filter=FilterExpression(
                filter=Filter(
                    field_name="sessionSourceMedium",
                    string_filter=Filter.StringFilter(value="google / organic")
                )
            ),
            limit=10
        )
        
        response = client.run_report(request)
        
        total_organic_traffic = sum(int(row.metric_values[0].value) for row in response.rows)
        top_landing_pages = [
            {"url": row.dimension_values[0].value, "traffic": row.metric_values[0].value}
            for row in response.rows
        ]

        return {
            "performance_kpis": {
                "organic_traffic": f"{total_organic_traffic:,}",
            },
            "content_strategy": {
                "top_landing_pages": top_landing_pages,
            }
        }
    except Exception as e:
        print(f"🚨 ERROR fetching GA4 data: {e}")
        return {
            "performance_kpis": {"organic_traffic": "N/A"},
            "content_strategy": {"top_landing_pages": []}
        }

# part 2: CONTENT AUDIT SCRIPT

# Initialize NLTK resources
try:
    STOP_WORDS = set(stopwords.words('english'))
except:
    print("Downloading NLTK stopwords...")
    nltk.download('stopwords')
    STOP_WORDS = set(stopwords.words('english'))

def generate_keyword_from_content(content_body):
    """Generates a composite keyword from content body."""
    if not content_body or len(content_body) < 50:
        return "marketing project machine learning"

    text = re.sub(r'[^\w\s]', '', content_body).lower()
    words = word_tokenize(text)
    filtered_words = [w for w in words if w not in STOP_WORDS and len(w) > 1]
    word_counts = Counter(filtered_words)
    top_words = [word for word, count in word_counts.most_common(3)]
    generated_keyword = " ".join(top_words)
    
    return generated_keyword if generated_keyword else "marketing project machine learning"

def calculate_seo_score(metrics):
    """Calculates a weighted SEO score."""
    score = 0
    weights = {'keywordInTitle': 40, 'wordCount_multiplier': 30, 'readability_bonus': 15, 'sentiment_bonus': 15}
    if metrics['keywordInTitle'] == 1: score += weights['keywordInTitle']
    if 800 <= metrics['wordCount'] <= 1500: score += weights['wordCount_multiplier']
    elif 500 <= metrics['wordCount'] < 800 or metrics['wordCount'] > 1500: score += weights['wordCount_multiplier'] / 2
    if 60 <= metrics['readabilityScore'] <= 70: score += weights['readability_bonus']
    elif metrics['readabilityScore'] > 70: score += weights['readability_bonus'] / 2
    if metrics['sentimentCompoundScore'] > 0.1: score += weights['sentiment_bonus']
    return int(min(score, 100))

def generate_suggestions(metrics, target_keyword):
    """Generates actionable marketing suggestions."""
    suggestions = []
    if metrics['keywordInTitle'] == 0:
        suggestions.append(f"🔴 **High Priority:** Add the keyword '{target_keyword}' to the article title.")
    if metrics['wordCount'] < 800:
        suggestions.append(f"🟡 **Content Depth:** Expand article. Current: {metrics['wordCount']} words. Target: 800+.")
    if metrics['readabilityScore'] < 60:
        suggestions.append(f"🟡 **Readability:** Hard to read (Score: {metrics['readabilityScore']:.1f}). Use shorter sentences.")
    density = (metrics['keywordCount'] / metrics['wordCount']) * 100 if metrics['wordCount'] > 0 else 0
    if density < 0.5:
        suggestions.append(f"🟡 **Keyword Density:** Increase usage of '{target_keyword}'. Current: {density:.2f}%.")
    return suggestions

def analyze_content_file(filepath, target_keyword):
    """Analyzes a single content file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        post = frontmatter.load(f)
    
    title = post.metadata.get('title', 'No Title')
    content_body = post.content
    word_count = textstat.lexicon_count(content_body) # Removed 'remove_punct=True'
    readability = textstat.flesch_reading_ease(content_body)
    keyword_in_title = 1 if target_keyword.lower() in title.lower() else 0
    keyword_count = content_body.lower().count(target_keyword.lower())
    sentiment_score = 0.0 # Placeholder, VADER can be slow/problematic in build

    metrics = {
        "wordCount": word_count,
        "readabilityScore": readability,
        "keywordInTitle": keyword_in_title,
        "keywordCount": keyword_count,
        "sentimentCompoundScore": sentiment_score
    }
    
    report = {
        "slug": os.path.basename(filepath).replace('.md', '').replace('.mdx', ''),
        "title": title,
        "targetKeyword": target_keyword,
        "metrics": metrics,
        "seoScore": calculate_seo_score(metrics),
        "suggestions": generate_suggestions(metrics, target_keyword)
    }
    return report

def run_content_audit():
    """Runs the full content audit and saves to JSON."""
    print("Starting content audit...")
    all_reports = []
    if not os.path.isdir(CONTENT_DIR):
        print(f"❌ ERROR: Content directory not found: '{CONTENT_DIR}'")
        return

    for filename in os.listdir(CONTENT_DIR):
        filename_lower = filename.lower()
        if filename.startswith('.') or not filename_lower.endswith(('.md', '.mdx')):
            continue

        filepath = os.path.join(CONTENT_DIR, filename)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                post = frontmatter.load(f)
            target_keyword = post.metadata.get('targetKeyword') or generate_keyword_from_content(post.content)
            report = analyze_content_file(filepath, target_keyword)
            all_reports.append(report)
        except Exception as e:
            print(f"❌ ERROR processing {filename}: {e}. Skipping.")
    
    os.makedirs(os.path.dirname(CONTENT_AUDIT_OUTPUT_FILE), exist_ok=True)
    with open(CONTENT_AUDIT_OUTPUT_FILE, 'w') as f:
        json.dump(all_reports, f, indent=2)
    print(f"✅ Content audit complete! Saved to: {CONTENT_AUDIT_OUTPUT_FILE} ({len(all_reports)} articles)")

def run_live_vitals_fetch():
    """Fetches live vitals and saves to JSON."""
    print("Starting live SEO vitals fetch...")
    credentials = get_google_credentials()
    if credentials:
        vitals_data = fetch_live_seo_data(credentials)
        os.makedirs(os.path.dirname(LIVE_VITALS_OUTPUT_FILE), exist_ok=True)
        with open(LIVE_VITALS_OUTPUT_FILE, 'w') as f:
            json.dump(vitals_data, f, indent=2)
        print(f"✅ Live SEO vitals fetch complete! Saved to: {LIVE_VITALS_OUTPUT_FILE}")
    else:
        print("❌ SKIPPING live vitals fetch: No credentials found.")

# main execution

if __name__ == "__main__":
    # download NLTK data if missing (needed for keyword generation)
    try:
        word_tokenize("test")
    except LookupError:
        print("Downloading NLTK 'punkt' data...")
        nltk.download('punkt')

    run_content_audit()
    run_live_vitals_fetch()
    print("✅ All scripts finished.")