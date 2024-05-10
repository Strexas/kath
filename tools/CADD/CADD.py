import requests

def fetch_cadd_score(cadd_version, chromosome, position):
    url = f"https://cadd.gs.washington.edu/api/v1.0/{cadd_version}/{chromosome}:{position}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            print(f"Error: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None
