import sys, json
from datetime import datetime

def calculate_hotspot_score(sst, chlorophyll, salinity, species):
    base_score = 0
    if species == "Pomfret":
        if 26 <= sst <= 29: base_score += 30
        if chlorophyll > 0.7: base_score += 25
        if 35 <= salinity <= 36: base_score += 20
    elif species == "Tuna":
        if 28 <= sst <= 31: base_score += 30
        if chlorophyll > 0.5: base_score += 25
        if salinity > 35.5: base_score += 20
    elif species == "Mackerel":
        if 27 <= sst <= 30: base_score += 25
        if chlorophyll > 0.6: base_score += 20
        if 34.5 <= salinity <= 36: base_score += 15
    current_hour = datetime.utcnow().hour
    if 4 <= current_hour <= 8:
        base_score += 25
    return min(base_score, 100)

def calculate_market_timing(current_price, festival_days, demand_trend):
    profit_score = 0
    if festival_days <= 7:
        profit_score += (7 - festival_days) * 5
    if demand_trend > 0.1:
        profit_score += 20
    return profit_score

if __name__ == '__main__':
    payload = json.load(sys.stdin)
    action = payload.get('action')
    if action == 'hotspot':
        score = calculate_hotspot_score(
            payload.get('sst', 0),
            payload.get('chlorophyll', 0),
            payload.get('salinity', 0),
            payload.get('species', '')
        )
        print(json.dumps({'score': score}))
    elif action == 'market':
        score = calculate_market_timing(
            payload.get('current_price', 0.0),
            payload.get('festival_days', 99),
            payload.get('demand_trend', 0.0)
        )
        print(json.dumps({'score': score}))
    else:
        print(json.dumps({'error': 'unknown action'}))