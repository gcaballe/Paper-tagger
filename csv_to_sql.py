import csv

# --- Configuration ---
INPUT_FILE = 'input.csv'
OUTPUT_FILE = 'output.sql'
BATCH_SIZE = 50


# THIS FILE IS TO CREATE A SQL SCRIPT TO EXECUTE ON THE DATABASE
# BEFORE THIS, execute the DLL script

# input.csv is a CSV saved from the .xlsx the client provides. This CSV has been saved in UTF-8 encoding, and uses , as field delimeter, and $ as text delimeter

def create_sql_script():
    print(f"Reading {INPUT_FILE} (Encoding: utf-8)...")
    
    try:
        # Input as utf-8, Output as utf-8 for compatibility
        with open(INPUT_FILE, mode='r', encoding='utf-8', newline='') as csv_file, \
             open(OUTPUT_FILE, mode='w', encoding='utf-8') as sql_file:
            
            # Using $ as quotechar for your text fields
            reader = csv.reader(csv_file, delimiter=',', quotechar='$')
            
            # --- SKIP THE FIRST LINE ---
            next(reader, None) 
            
            batch = []
            row_count = 0
            
            for row in reader:
                # Basic check for empty rows
                if len(row) < 2:
                    continue 
                
                # 1. Extract and clean data
                # We also escape quotes in num_pacient just in case it contains them
                num_pacient = row[0].strip().replace("'", "''")
                raw_text = row[1].strip().replace("'", "''")
                
                # 2. Build the row string 
                # Note: both num_pacient and text are now wrapped in single quotes
                sql_value = f"('{num_pacient}', '{raw_text}', 'pending')"
                
                batch.append(sql_value)
                row_count += 1
                
                # 3. Write in chunks of 50
                if len(batch) == BATCH_SIZE:
                    write_batch(sql_file, batch)
                    batch = [] 
            
            # 4. Write the final partial batch
            if batch:
                write_batch(sql_file, batch)
                
        print(f"Success! Processed {row_count} data rows.")
        print(f"SQL file generated: {OUTPUT_FILE}")

    except FileNotFoundError:
        print(f"Error: {INPUT_FILE} not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

def write_batch(file_obj, values_list):
    """Formats the batch into a single INSERT statement."""
    header = "INSERT INTO papers (numpacient, text, estat) VALUES \n"
    body = ",\n".join(values_list)
    file_obj.write(header + body + ";\n\n")

if __name__ == "__main__":
    create_sql_script()