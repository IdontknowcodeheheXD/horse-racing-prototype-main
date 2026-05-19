import pandas as pd

file_path = r'C:\Users\ACER\Downloads\Horse_Racing_BR_Table.xlsx'

try:
    # Read the Excel file
    df = pd.read_excel(file_path)
    
    # Set pandas display options to show all columns and rows
    pd.set_option('display.max_columns', None)
    pd.set_option('display.max_rows', None)
    pd.set_option('display.width', None)
    pd.set_option('display.max_colwidth', None)
    
    # Save to a CSV file for easier viewing
    output_file = r'C:\Users\ACER\Downloads\Horse_Racing_BR_Table_Output.csv'
    df.to_csv(output_file, index=True, encoding='utf-8')
    
    print(f"Data saved to: {output_file}")
    print(f"\nTotal rows: {len(df)}")
    print(f"Total columns: {len(df.columns)}")
    print(f"\nColumns: {list(df.columns)}")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
