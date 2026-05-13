import kagglehub
import os

def download():
    # Download latest version
    path = kagglehub.dataset_download("aadyasingh55/drug-dataset")
    print(f"PATH_TO_DATASET:{path}")

if __name__ == "__main__":
    download()
