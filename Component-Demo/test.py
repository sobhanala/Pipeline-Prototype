import requests
import pandas as pd
from io import BytesIO


csv_buffer = BytesIO()

df = pd.read_csv("./data.csv")
df.to_csv(csv_buffer, index=False)
csv_buffer.seek(0)

url = "http://localhost:8000/train"

files = {
    "file": ("data.csv", csv_buffer, "text/csv"),
}
data = {
    "target_column": "target",
}

response = requests.post(url, files=files, data=data)

print("Status code:", response.status_code)
print("Response JSON:", response.json())
