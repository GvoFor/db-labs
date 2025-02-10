import psycopg2
from environment import DB_NAME, DB_USER, DB_PASSWORD

connection = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASSWORD)
cursor = connection.cursor()

cursor.execute("DROP TABLE IF EXISTS user_counter;")
cursor.execute("CREATE TABLE user_counter (user_id serial PRIMARY KEY, counter INTEGER DEFAULT 0, version INTEGER DEFAULT 0);")
cursor.execute("INSERT INTO user_counter(counter) VALUES(0)")

connection.commit()

cursor.close()
connection.close()