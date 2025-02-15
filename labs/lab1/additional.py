# Author: Mykhailo Pumnia

import psycopg2
from random import randint
from collections.abc import Callable
from threading import Thread
from time import time
from environment import DB_NAME, DB_USER, DB_PASSWORD

NUMBER_OF_ROWS = 100_000
NUMBER_OF_THREADS = 10
NUMBER_OF_INCREMENTS = 10_000

def get_and_reset_counter() -> int:
  connection = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASSWORD)
  cursor = connection.cursor()
  cursor.execute("SELECT SUM(counter) FROM user_counter;")
  (counter,) = cursor.fetchone()
  cursor.execute("UPDATE user_counter SET counter = 0;")
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

  threads: list[Thread] = []
  for _ in range(NUMBER_OF_THREADS):
    threads.append(Thread(target=start_counter))

  starting_time = time()
  for thread in threads:
    thread.start()

  for thread in threads:
    thread.join()

  passed_time = time() - starting_time
  counter_value = get_and_reset_counter()
  
  
  print(f'Finish! It tooks {passed_time:.5f}s to finish')
  print(f'The sum of counters: {counter_value}')
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

def get_random_user_id():
  return randint(1, NUMBER_OF_ROWS)

def part1_random(connection: psycopg2.extensions.connection, cursor: psycopg2.extensions.cursor):
  user_id = get_random_user_id()
  cursor.execute("SELECT counter FROM user_counter WHERE user_id = %s;", (user_id,))
  (counter,) = cursor.fetchone()
  counter = counter + 1
  cursor.execute("UPDATE user_counter SET counter = %s WHERE user_id = %s;", (counter, user_id))
  connection.commit()

def part2_random(connection: psycopg2.extensions.connection, cursor: psycopg2.extensions.cursor):
  user_id = get_random_user_id()
  cursor.execute("UPDATE user_counter SET counter = counter + 1 WHERE user_id = %s;", (user_id,))
  connection.commit()

def part3_random(connection: psycopg2.extensions.connection, cursor: psycopg2.extensions.cursor):
  user_id = get_random_user_id()
  cursor.execute("SELECT counter FROM user_counter WHERE user_id = %s FOR UPDATE;", (user_id,))
  (counter,) = cursor.fetchone()
  counter = counter + 1
  cursor.execute("UPDATE user_counter SET counter = %s WHERE user_id = %s;", (counter, user_id))
  connection.commit()

def part4_random(connection: psycopg2.extensions.connection, cursor: psycopg2.extensions.cursor):
  user_id = get_random_user_id()
  while True:
    cursor.execute("SELECT counter, version FROM user_counter WHERE user_id = %s;", (user_id, ))
    (counter, version) = cursor.fetchone()
    counter = counter + 1
    cursor.execute(
      "UPDATE user_counter SET counter = %s, version = %s WHERE user_id = %s AND version = %s;",
      (counter, version + 1, user_id, version)
    )
    connection.commit()

    if cursor.rowcount > 0:
      break

if __name__ == '__main__':
  print('Part 1')
  run_and_measure(part1)

  print('Part 1 (random rows)')
  run_and_measure(part1_random)

  print('Part 2')
  run_and_measure(part2)

  print('Part 2 (random rows)')
  run_and_measure(part2_random)

  print('Part 3')
  run_and_measure(part3)

  print('Part 3 (random rows)')
  run_and_measure(part3_random)

  print('Part 4')
  run_and_measure(part4)

  print('Part 4 (random rows)')
  run_and_measure(part4_random)