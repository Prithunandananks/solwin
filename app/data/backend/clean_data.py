import os
import pandas as pd

def clean_csv_data(file_path: str = None) -> pd.DataFrame:
    """
    Cleans customer support & phishing dataset CSV.
    - Fills missing values (NaN) with empty strings/defaults.
    - Strips leading and trailing excessive whitespace.
    - Drops duplicate records.
    """
    if not file_path:
        # Resolve path relative to project structure (app/data)
        data_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        possible_paths = [
            os.path.join(data_dir, "unified_customer_phishing_data (1).csv"),
            os.path.join(data_dir, "unified_customer_phishing_data.csv"),
            os.path.join(data_dir, "unified_customer_phishing_data_subset.csv"),
            os.path.join(data_dir, "unified_customer_phishing_data_subset (1).csv"),
        ]
        file_path = None
        for p in possible_paths:
            if os.path.exists(p):
                file_path = p
                break

        if not file_path:
            raise FileNotFoundError(f"Data file not found in paths: {possible_paths}")

    df = pd.read_csv(file_path)

    # Ensure required columns exist
    required_cols = ["message", "subject", "intent", "issue"]
    for col in required_cols:
        if col not in df.columns:
            df[col] = ""

    # Select target columns
    df = df[required_cols].copy()

    # Fill NaN values with empty string
    df = df.fillna("")

    # Convert all columns to string type and strip whitespace
    for col in required_cols:
        df[col] = df[col].astype(str).str.strip()

    # Drop duplicate records based on all four fields
    initial_count = len(df)
    df = df.drop_duplicates().reset_index(drop=True)
    cleaned_count = len(df)

    print(f"Data Cleaning Completed: {initial_count} initial records -> {cleaned_count} unique records.")
    return df

if __name__ == "__main__":
    df_cleaned = clean_csv_data()
    print("Sample cleaned records:")
    print(df_cleaned.head(5))
