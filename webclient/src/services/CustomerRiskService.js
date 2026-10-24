import {toast} from "react-toastify";

const analyzeCustomersRisk = async (csvFile) => {
    const formData = new FormData();
    formData.append("file", csvFile);
    formData.append("target_column", "target");

    const url = "http://localhost:8000/train";

    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData?.detail || "خطای ناشناخته‌ای رخ داده است.";
            toast.error(`خطا: ${errorMessage}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        toast.error("خطا در اتصال سرور.");
        return null;
    }
};

const getNullImputerComponentCode = () => {
    return "class NullImputerComponent(Component):\n" +
        "    def __init__(self):\n" +
        "        self.imputer = None\n" +
        "        self.numeric_cols = []\n" +
        "        self.categorical_cols = []\n" +
        "\n" +
        "    def fit(self, X, y=None):\n" +
        "        self.numeric_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()\n" +
        "        self.categorical_cols = X.select_dtypes(include=['object', 'category']).columns.tolist()\n" +
        "\n" +
        "        num_imputer = SimpleImputer(strategy='mean')\n" +
        "        cat_imputer = SimpleImputer(strategy='most_frequent')\n" +
        "\n" +
        "        self.imputer = ColumnTransformer([\n" +
        "            ('num', num_imputer, self.numeric_cols),\n" +
        "            ('cat', cat_imputer, self.categorical_cols)\n" +
        "        ])\n" +
        "\n" +
        "        self.imputer.fit(X)\n" +
        "\n" +
        "    def transform(self, X):\n" +
        "        transformed = self.imputer.transform(X)\n" +
        "        columns = self.numeric_cols + self.categorical_cols\n" +
        "        return pd.DataFrame(transformed, columns=columns, index=X.index)\n" +
        "    \n";
}

const getScalerEncoderComponent = () => {
    return "class ScalerEncoderComponent(Component):\n" +
        "    def __init__(self, numeric_cols, categorical_cols):\n" +
        "        self.numeric_cols = numeric_cols\n" +
        "        self.categorical_cols = categorical_cols\n" +
        "        self.encoder = None\n" +
        "\n" +
        "    def fit(self, X, y=None):\n" +
        "        num_pipe = StandardScaler()\n" +
        "        cat_pipe = OneHotEncoder(handle_unknown='ignore')\n" +
        "\n" +
        "        self.encoder = ColumnTransformer([\n" +
        "            ('num', num_pipe, self.numeric_cols),\n" +
        "            ('cat', cat_pipe, self.categorical_cols)\n" +
        "        ])\n" +
        "\n" +
        "        self.encoder.fit(X)\n" +
        "\n" +
        "    def transform(self, X):\n" +
        "        return self.encoder.transform(X)\n";
}

const getClassifierComponent = () => {
    return "class ClassifierComponent(Component):\n" +
        "    def __init__(self):\n" +
        "        self.model = LogisticRegression()\n" +
        "\n" +
        "    def fit(self, X, y):\n" +
        "        self.model.fit(X, y)\n" +
        "\n" +
        "    def transform(self, X):\n" +
        "        return self.model.predict(X)\n";
}

const CustomerRiskService = {
    analyzeCustomersRisk,
    getNullImputerComponentCode,
    getScalerEncoderComponent,
    getClassifierComponent
}
export default CustomerRiskService;