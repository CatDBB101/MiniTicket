# MiniTicket
The small project use to learn GraphQL and PostgreSQL.

# Techstack
- bun
- Apollo Server
- GraphQL
- PostgreSQL
- Bun.SQL

# How to run
```bash
bun run dev
```
It's just running ```bun --watch run ./src/index.ts```, API run on port 4000

# How to use
### Movies
- __movies__ (Query) - Query all filtered arguments.
### Schedules
- __schedules__ (Query) - Query all filtered arguments.
- __createSchedule__ (Mutation) - Create new movie showtime schedule.
- __deleteSchedule__ (Mutation) - Delete exist schedule.
### Reserves
- __reserves__ (Query) - Query all filtered arguments.
- __createReserve__ (Mutation) - Create new reserve of schedule, theater's seat.
- __deleteReserve__ (Mutation) - Delete exist reserve.

# Database Structure
### Movies
```SQL
CREATE TABLE IF NOT EXISTS public.movies
(
    id serial NOT NULL,
    name character varying(40) COLLATE pg_catalog."default" NOT NULL,
    genre moviegenre NOT NULL,
    CONSTRAINT movies_pkey PRIMARY KEY (id),
    CONSTRAINT movies_name_key UNIQUE (name)
);
```
### Schedules
```SQL
CREATE TABLE IF NOT EXISTS public.schedules
(
    id serial NOT NULL,
    showtime timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    movie_id integer,
    theatre integer NOT NULL,
    CONSTRAINT schedules_pkey PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.schedules
    ADD CONSTRAINT fk_movie FOREIGN KEY (movie_id)
    REFERENCES public.movies (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
```
### Reserves
```SQL
CREATE TABLE IF NOT EXISTS public.reserves
(
    id serial NOT NULL,
    schedule_id integer NOT NULL,
    seat_number integer NOT NULL,
    CONSTRAINT unique_schedule_seat UNIQUE (schedule_id, seat_number)
);

ALTER TABLE IF EXISTS public.reserves
    ADD CONSTRAINT fk_schedules FOREIGN KEY (schedule_id)
    REFERENCES public.schedules (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
```
