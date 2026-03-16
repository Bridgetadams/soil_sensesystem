# Government Fertilizer Decision System

This project is a machine learning system designed to analyze soil data and support fertilizer allocation decisions for farmers.  
The system uses **Random Forest** and **XGBoost** models trained on **2,003 soil samples** to evaluate soil fertility and recommend fertilizer priorities.

## Project Goal

The main goal of this system is to help **governments and NGOs allocate fertilizer subsidies efficiently** by identifying farmers whose soil needs fertilizer the most.

Instead of distributing fertilizer equally, the system prioritizes farmers based on soil fertility levels.

## What the System Does

### 1. Classify Soil Fertility

Using machine learning (Random Forest or XGBoost), the system analyzes **16 soil parameters**, including:

- Nitrogen (N)  
- Phosphorus (P)  
- Potassium (K)  
- Soil pH  
- Organic Carbon  
- Other soil indicators  

It classifies the soil into three fertility levels:

- **Low Fertility**
- **Medium Fertility**
- **High Fertility**

### 2. Make Fertilizer Allocation Decisions

Based on the predicted fertility level, the system recommends fertilizer distribution priorities:

- **Low Fertility → Give fertilizer (HIGH priority)**
- **Medium Fertility → Conditional support (MEDIUM priority)**
- **High Fertility → No fertilizer needed (LOW priority)**

This helps ensure fertilizer resources go to farmers who need them most.

### 3. Support Bulk Processing

Field agents can upload **CSV or Excel files** containing soil data for multiple farmers.  
The system processes all records and generates fertility predictions and fertilizer recommendations at once.

### 4. Decision Logging

The system keeps a **decision history log** for:

- transparency  
- accountability  
- record-keeping of fertilizer allocation decisions  

## Technologies Used

- HTML  
- CSS  
- JavaScript  
- Python  
- Scikit-learn  
- XGBoost  
- Pandas  
- NumPy  

## Author

Bridget Adams  
Mzuzu University
