import kagglehub

print("Downloading medicine-dataset...")
medicine_path = kagglehub.dataset_download("ujjwalaggarwal402/medicine-dataset")
print("Path to medicine dataset:", medicine_path)

print("\nDownloading bangalore-doctors-dataset...")
doctor_path = kagglehub.dataset_download("kevinmathewsgeorge/bangalore-doctors-dataset-from-practo")
print("Path to doctor dataset:", doctor_path)
