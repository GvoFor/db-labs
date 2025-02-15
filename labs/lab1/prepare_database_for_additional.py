import psycopg2
from environment import DB_NAME, DB_USER, DB_PASSWORD

TOTAL_ROWS_N = 100_000
BATCHES_N = 100
ROWS_IN_BATCH = TOTAL_ROWS_N // BATCHES_N

connection = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASSWORD)
cursor = connection.cursor()

cursor.execute("DROP TABLE IF EXISTS user_counter;")
cursor.execute("CREATE TABLE user_counter (user_id serial PRIMARY KEY, counter INTEGER DEFAULT 0, version INTEGER DEFAULT 0);")

for _ in range(BATCHES_N):
  values = ', '.join(['(0)' for _ in range(ROWS_IN_BATCH)])
  cursor.execute(f"INSERT INTO user_counter(counter) VALUES {values}")

connection.commit()

cursor.close()
connection.close()