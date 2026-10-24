# Machine Learning Pipeline Prototype

A React interface and FastAPI demonstration for CSV-based classification. The backend builds a component pipeline for data preparation, imputation, feature encoding/scaling, logistic-regression training, and evaluation.

## Structure

- `Component-Demo/`: pipeline components, API, and manual request example.
- `webclient/`: React 19 browser interface.
- `Component-Demo/data.example.csv`: synthetic sample data for the public copy.

The original CSV dataset is excluded. Supply a dataset you are authorized to use, including a `Customer ID` column and the target column named in the request.

## Run the backend

Create a Python virtual environment, then install the dependencies used by this demonstration:

```sh
python -m pip install fastapi uvicorn pandas scikit-learn python-multipart requests
cd Component-Demo
python -m uvicorn api:app --host 127.0.0.1 --port 8000
```

Open `http://127.0.0.1:8000/docs`. The `POST /train` endpoint accepts a CSV upload and `target_column` form field. It returns validation accuracy and a limited set of customer-label predictions.

The manual `test.py` expects a local `data.csv`. Copy `data.example.csv` to that name for an initial example, or provide your own compatible data. Sample results are demonstrations, not validated lending decisions.

## Run the frontend

```sh
cd webclient
npm ci
npm start
```

Check its service URL and the backend CORS list before connecting the two processes. The source does not supply a pinned Python environment or a production deployment.

## Credits and source

This is a public portfolio copy of the shared project [UTeam-400/Pipeline-Prototype](https://github.com/UTeam-400/Pipeline-Prototype), prepared for Sobhan Alaeddini's account. Original authorship and existing license notices are retained. See [SOURCE.md](SOURCE.md) for the source revision and publication notes.
