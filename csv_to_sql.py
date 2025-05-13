import csv
import os

def csv_to_sql():
    # Input and output file paths
    csv_file = 'Cartoes-Campeonato.csv'
    sql_file = 'cartao.SQL'
    
    # Open the CSV file and read headers
    with open(csv_file, 'r', encoding='utf-8') as file:
        csv_reader = csv.reader(file)
        headers = next(csv_reader)
        
        # Create SQL file
        with open(sql_file, 'w', encoding='utf-8') as sql:
            # Write CREATE TABLE statement
            sql.write("CREATE TABLE cartoes (\n")
            for i, header in enumerate(headers):
                # Determine SQL data type based on header name
                if header in ['partida_id', 'num_camisa', 'minuto']:
                    data_type = "INTEGER"
                else:
                    data_type = "VARCHAR(255)"
                
                # Add comma for all but the last column
                if i < len(headers) - 1:
                    sql.write(f"    {header} {data_type},\n")
                else:
                    sql.write(f"    {header} {data_type}\n")
            
            sql.write(");\n\n")
            
            # Write INSERT statements for each row
            sql.write("-- Inserting data\n")
            
            # Counter for skipped rows
            skipped_rows = 0
            inserted_rows = 0
            
            for row in csv_reader:
                # Skip rows with any null/empty values
                if '' in row or any(value.strip() == '' for value in row):
                    skipped_rows += 1
                    continue
                    
                # Format values for SQL insert
                formatted_values = []
                for value in row:
                    if value.isdigit():
                        formatted_values.append(value)
                    else:
                        # Escape single quotes and wrap in quotes
                        escaped_value = value.replace("'", "''").replace('"', '')
                        formatted_values.append(f"'{escaped_value}'")
                
                values_str = ", ".join(formatted_values)
                sql.write(f"INSERT INTO cartoes ({', '.join(headers)}) VALUES ({values_str});\n")
                inserted_rows += 1
            
            print(f"SQL file '{sql_file}' created successfully.")
            print(f"Records processed: {inserted_rows + skipped_rows}")
            print(f"Records inserted: {inserted_rows}")
            print(f"Records skipped (had null values): {skipped_rows}")

if __name__ == "__main__":
    csv_to_sql() 