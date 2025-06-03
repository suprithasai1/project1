@echo off
echo Installing required Python packages...
pip install -r requirements.txt
 
echo Starting Alzheimer's prediction server...
start cmd /k python enhanced_alzheimer_server.py
 
echo Starting Parkinson's prediction server...
start cmd /k python fixed_pure_parkinson_server.py
 
echo Both servers are starting. Please check the opened command windows for logs.