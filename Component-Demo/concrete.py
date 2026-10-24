import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer

from component import Component

class DataLoaderComponent(Component):
    def __init__(self, dataframe: pd.DataFrame, target_column: str):
        self.dataframe = dataframe
        self.target_column = target_column

    def fit(self, X, y=None):
        pass

    def transform(self, X=None):
        X = self.dataframe.drop(columns=[self.target_column])
        y = self.dataframe[self.target_column]
        return train_test_split(X, y, test_size=0.2, random_state=42)


class NullImputerComponent(Component):
    def __init__(self):
        self.imputer = None
        self.numeric_cols = []
        self.categorical_cols = []

    def fit(self, X, y=None):
        self.numeric_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
        self.categorical_cols = X.select_dtypes(include=['object', 'category']).columns.tolist()

        num_imputer = SimpleImputer(strategy='mean')
        cat_imputer = SimpleImputer(strategy='most_frequent')

        self.imputer = ColumnTransformer([
            ('num', num_imputer, self.numeric_cols),
            ('cat', cat_imputer, self.categorical_cols)
        ])

        self.imputer.fit(X)

    def transform(self, X):
        transformed = self.imputer.transform(X)
        columns = self.numeric_cols + self.categorical_cols
        return pd.DataFrame(transformed, columns=columns, index=X.index)
    

class ScalerEncoderComponent(Component):
    def __init__(self, numeric_cols, categorical_cols):
        self.numeric_cols = numeric_cols
        self.categorical_cols = categorical_cols
        self.encoder = None

    def fit(self, X, y=None):
        num_pipe = StandardScaler()
        cat_pipe = OneHotEncoder(handle_unknown='ignore')

        self.encoder = ColumnTransformer([
            ('num', num_pipe, self.numeric_cols),
            ('cat', cat_pipe, self.categorical_cols)
        ])

        self.encoder.fit(X)

    def transform(self, X):
        return self.encoder.transform(X)

class ClassifierComponent(Component):
    def __init__(self):
        self.model = LogisticRegression()

    def fit(self, X, y):
        self.model.fit(X, y)

    def transform(self, X):
        return self.model.predict(X)


class EvaluatorComponent(Component):
    def fit(self, X, y=None):
        pass

    def transform(self, inputs):
        y_true, y_pred = inputs
        acc = accuracy_score(y_true, y_pred)
        print(f"Accuracy: {acc}")
        return acc


