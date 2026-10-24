import pandas as pd
from typing import List, Tuple

from concrete import (
    DataLoaderComponent,
    NullImputerComponent,
    ScalerEncoderComponent,
    ClassifierComponent,
    EvaluatorComponent,
)


class MLTrainingPipeline:
    def __init__(self, dataframe: pd.DataFrame, target_column: str):
        self.dataframe = dataframe
        self.target_column = target_column
        self._build_pipeline()

    def _build_pipeline(self) -> None:
        self.loader = DataLoaderComponent(self.dataframe, self.target_column)
        self.null_imputer = NullImputerComponent()
        self.scaler_encoder = None
        self.classifier = ClassifierComponent()
        self.evaluator = EvaluatorComponent()


    def run(self) -> Tuple[float, List[Tuple[str, bool]]]:
        X_train, X_test, y_train, y_test = self.loader.transform()

        self.ids = X_test["Customer ID"]
        X_train = X_train.drop(columns=["Customer ID"])
        X_test = X_test.drop(columns=["Customer ID"])

        self.null_imputer.fit(X_train)
        X_train = self.null_imputer.transform(X_train)
        X_test = self.null_imputer.transform(X_test)

        self.scaler_encoder = ScalerEncoderComponent(
            self.null_imputer.numeric_cols, self.null_imputer.categorical_cols
        )
        self.scaler_encoder.fit(X_train)
        X_train = self.scaler_encoder.transform(X_train)
        X_test = self.scaler_encoder.transform(X_test)

        self.classifier.fit(X_train, y_train)
        y_pred = self.classifier.transform(X_test)
        accuracy = self.evaluator.transform((y_test, y_pred))

        customer_preds = list(zip(self.ids.tolist(), ["false" if y == "Fully Paid" else "true" for y in y_pred.tolist()]))

        return float(accuracy), customer_preds
