from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List
from io import StringIO
import pandas as pd

from pipeline import MLTrainingPipeline

app = FastAPI(
    title="CSV Classification API",
    description=(
        "Upload a CSV dataset and specify the target column to train a "
        "Logistic Regression model; the endpoint returns the validation accuracy."
    ),
    version="1.0.0",
)


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://your-frontend-domain.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=Dict[str, str])
async def root() -> Dict[str, str]:
    return {
        "message": (
            "CSV Classification API. POST /train with a CSV file (multipart/form‑data) "
            "and a 'target_column' field."
        )
    }


@app.post("/train", response_model=Dict[str, object])
async def train_model(
    file: UploadFile = File(..., description="CSV file containing the dataset"),
    target_column: str = Form(..., description="Name of the target column in the uploaded CSV"),
) -> Dict[str, object]:


    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="فقط فایلی با فرمت csv. قابل قبول است!")

    try:
        contents = await file.read()
        decoded = contents.decode("utf-8")
        df = pd.read_csv(StringIO(decoded))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading CSV file: {str(e)}")


    if target_column not in df.columns:
        raise HTTPException(
            status_code=400,
            detail=f"'ستون تارگت مورد نظر با اسم:  {target_column} در فایل آپلود شده پیدا نشد!'",
        )


    try:
        pipeline = MLTrainingPipeline(df, target_column)
        accuracy, customers = pipeline.run()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"اررور در پایپ لاین: {str(e)}")

    
    return {
        "accuracy": accuracy,
        "customers": [{"id": cid, "label": pred} for cid, pred in customers[:50]]
    }
