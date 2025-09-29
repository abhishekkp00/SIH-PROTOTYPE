import sys, json
from datetime import datetime
from pathlib import Path

# Import analytics from project root ai/analytics.py
ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'ai'))
from analytics import calculate_hotspot_score  # type: ignore

if __name__ == '__main__':
    payload = json.load(sys.stdin)
    score = calculate_hotspot_score(
        payload.get('sst', 0),
        payload.get('chlorophyll', 0),
        payload.get('salinity', 0),
        payload.get('species', '')
    )
    print(json.dumps({'score': score}))