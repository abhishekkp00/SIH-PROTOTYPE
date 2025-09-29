import sys, json
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'ai'))
from analytics import calculate_market_timing  # type: ignore

if __name__ == '__main__':
    payload = json.load(sys.stdin)
    score = calculate_market_timing(
        payload.get('current_price', 0.0),
        payload.get('festival_days', 99),
        payload.get('demand_trend', 0.0)
    )
    print(json.dumps({'score': score}))