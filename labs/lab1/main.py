# Author: Mykhailo Pumnia

import psycopg2
from collections.abc import Callable
from threading import Thread
from time import time
from environment import DB_NAME, DB_USER, DB_PASSWORD

NUMBER_OF_RUNS_FOR_MEASURE = 3
NUMBER_OF_THREADS = 1
NUMBER_OF_INCREMENTS = 10_000

def avarage(values: list[float]) -> float:
  return sum(values) / len(values)

def get_and_reset_counter() -> int:
  connection = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASSWORD)
  cursor = connection.cursor()
  cursor.execute("SELECT counter FROM user_counter WHERE user_id = %s;", (1,))
  (counter,) = cursor.fetchone()
  cursor.execute("UPDATE user_counter SET counter = 0 WHERE user_id = %s;", (1,))
  connection.commit()
  cursor.close()
  connection.close()
  return counter

def run_and_measure(part: Callable[[psycopg2.extensions.connection, psycopg2.extensions.cursor], None]):
  def start_counter():
    connection = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASSWORD)
    cursor = connection.cursor()

    for _ in range(NUMBER_OF_INCREMENTS): 
      part(connection, cursor)

    cursor.close()
    connection.close()

  print('Starting measuring...')

  last_counter_value = 0
  passed_times: list[float] = []
  for i in range(NUMBER_OF_RUNS_FOR_MEASURE):
    threads: list[Thread] = []
    for _ in range(NUMBER_OF_THREADS):
      threads.append(Thread(target=start_counter))

    print(f'Running cycle {i+1}...')

    starting_time = time()
    for thread in threads:
      thread.start()

    for thread in threads:
      thread.join()

    passed_time = time() - starting_time
    passed_times.append(passed_time)

    last_counter_value = get_and_reset_counter()
  

  min_time = min(passed_times)
  max_time = max(passed_times)
  avg_time = avarage(passed_times)
  
  print(f'Finish! It tooks {avg_time:.5f}s on average to finish')
  print(f'Min time taken: {min_time:.5f}s; Max time taken: {max_time:.5f}s')
  print(f'Last Counter: {last_counter_value}')
  print('--------------')

def part1(connection: psycopg2.extensions.connection, cursor: psycopg2.extensions.cursor):
  cursor.execute("SELECT counter FROM user_counter WHERE user_id = 1;")
  (counter,) = cursor.fetchone()
  counter = counter + 1
  cursor.execute("UPDATE user_counter SET counter = %s WHERE user_id = %s;", (counter, 1))
  connection.commit()

def part2(connection: psycopg2.extensions.connection, cursor: psycopg2.extensions.cursor):
  cursor.execute("UPDATE user_counter SET counter = counter + 1 WHERE user_id = %s;", (1,))
  connection.commit()

def part3(connection: psycopg2.extensions.connection, cursor: psycopg2.extensions.cursor):
  cursor.execute("SELECT counter FROM user_counter WHERE user_id = 1 FOR UPDATE;")
  (counter,) = cursor.fetchone()
  counter = counter + 1
  cursor.execute("UPDATE user_counter SET counter = %s WHERE user_id = %s;", (counter, 1))
  connection.commit()

def part4(connection: psycopg2.extensions.connection, cursor: psycopg2.extensions.cursor):
  while True:
    cursor.execute("SELECT counter, version FROM user_counter WHERE user_id = 1;")
    (counter, version) = cursor.fetchone()
    counter = counter + 1
    cursor.execute(
      "UPDATE user_counter SET counter = %s, version = %s WHERE user_id = %s AND version = %s;",
      (counter, version + 1, 1, version)
    )
    connection.commit()

    if cursor.rowcount > 0:
      break

if __name__ == '__main__':
  print('Part 1')
  run_and_measure(part1)

  print('Part 2')
  run_and_measure(part2)

  print('Part 3')
  run_and_measure(part3)

  print('Part 4')
  run_and_measure(part4)