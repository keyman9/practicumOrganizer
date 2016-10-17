import psycopg2

def connect_to_db():
    return psycopg2.connect('dbname=movie_recommendations user=practicum_normal password=password host=localhost')

def connect_to_db_admin():
    return psycopg2.connect('dbname=movie_recommendations user=practicum_admin password=password host=localhost')