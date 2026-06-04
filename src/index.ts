import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { loadFilesSync } from "@graphql-tools/load-files";
import { DateTimeResolver } from "graphql-scalars";
import {
    type MutationCreateReserveArgs,
    type MutationCreateScheduleArgs,
    type MutationDeleteReserveArgs,
    type MutationDeleteScheduleArgs,
    type QueryMoviesArgs,
    type QueryReservesArgs,
    type QuerySchedulesArgs,
} from "@/interface/graphql.interface";
import { sql } from "bun";

const typeDefs = loadFilesSync("./src/graphql/typedefs.graphql");

const resolvers = {
    DateTime: DateTimeResolver,
    Query: {
        /* movie */
        movies: async (_: unknown, args: QueryMoviesArgs) => {
            const { id, name, genre } = args.filter || {};
            return await sql`
                SELECT * FROM movies
                WHERE 
                    (${id === undefined}::boolean OR id = ${id}) AND
                    (${name === undefined}::boolean OR name ILIKE ${name ? `%${name}%` : null}) AND
                    (${genre === undefined}::boolean OR genre = ${genre})
            `;
        },

        /* schedule */
        schedules: async (_: unknown, args: QuerySchedulesArgs) => {
            const { id, theatre, movie_id, name, genre } = args.filter || {};
            return await sql`
                SELECT * FROM schedules
                INNER JOIN movies
	                ON schedules.movie_id = movies.id
                WHERE
                    (${id === undefined}::boolean OR schedules.id = ${id}) AND
                    (${theatre === undefined}::boolean OR schedules.theatre = ${theatre}) AND
                    (${movie_id === undefined}::boolean OR schedules.movie_id = ${movie_id}) AND
                    (${name === undefined}::boolean OR movies.name ILIKE ${name ? `%${name}%` : null}) AND
                    (${genre === undefined}::boolean OR genre = ${genre})
            `;
        },

        /* reserves */
        reserves: async (_: unknown, args: QueryReservesArgs) => {
            const {
                id,
                schedule_id,
                seat_number,
                theatre,
                movie_id,
                name,
                genre,
            } = args.filter ?? {};
            return await sql`
                SELECT
                    reserves.id,
                    reserves.seat_number,
                    -- schedules
                    schedules.id AS schedule_id,
                    schedules.showtime,
                    schedules.theatre,
                    -- movies
                    movies.name,
                    movies.id AS movie_id,
                    movies.genre
                FROM reserves
                INNER JOIN schedules
                    ON reserves.schedule_id = schedules.id
                INNER JOIN movies
                    ON schedules.movie_id = movies.id
                WHERE
                    (${id === undefined}::boolean OR reserves.id = ${id}) AND
                    (${schedule_id === undefined}::boolean OR reserves.schedule_id = ${schedule_id}) AND
                    (${seat_number === undefined}::boolean OR reserves.seat_number = ${seat_number}) AND
                    (${theatre === undefined}::boolean OR schedules.theatre = ${theatre}) AND
                    (${movie_id === undefined}::boolean OR schedules.movie_id = ${movie_id}) AND
                    (${name === undefined}::boolean OR movies.name ILIKE ${name ? `%${name}%` : null}) AND
                    (${genre === undefined}::boolean OR movies.genre = ${genre})
            `;
        },
    },
    Mutation: {
        /* schedule */
        createSchedule: async (
            _: unknown,
            args: MutationCreateScheduleArgs,
        ) => {
            const { theatre, movie_id, showtime } = args;
            return (
                await sql`
                WITH new_schedule AS (
                    INSERT INTO schedules VALUES (
                        DEFAULT,
                        ${showtime ?? "NOW()"},
                        ${movie_id},
                        ${theatre}
                    )
                    RETURNING *
                )
                SELECT * FROM new_schedule
                INNER JOIN movies
                    ON new_schedule.movie_id = movies.id
            `
            )[0];
        },
        deleteSchedule: async (
            _: unknown,
            args: MutationDeleteScheduleArgs,
        ) => {
            const { id } = args;
            return (
                await sql`
                    WITH del_schedule AS (
                        DELETE FROM schedules WHERE id = ${id}
                        RETURNING *
                    )
                    SELECT * FROM del_schedule
                    INNER JOIN movies
	                    ON del_schedule.movie_id = movies.id
                `
            )[0];
        },

        /* reserve */
        createReserve: async (_: unknown, args: MutationCreateReserveArgs) => {
            const { schedule_id, seat_number } = args;
            return (
                await sql`
                INSERT INTO reserves VALUES (
                    DEFAULT,
                    ${schedule_id},
                    ${seat_number}
                )
                RETURNING *
            `
            )[0];
        },
        deleteReserve: async (_: unknown, args: MutationDeleteReserveArgs) => {
            const { id } = args;
            return (
                await sql`
                WITH del_reserve AS (
                    DELETE FROM reserves WHERE id = ${id}
                    RETURNING *
                )
                SELECT
                    del_reserve.id,
                    del_reserve.seat_number,
                    -- schedules
                    schedules.id AS schedule_id,
                    schedules.showtime,
                    schedules.theatre,
                    -- movies
                    movies.name,
                    movies.id AS movie_id,
                    movies.genre
                FROM del_reserve
                INNER JOIN schedules
                    ON del_reserve.schedule_id = schedules.id
                INNER JOIN movies
                    ON schedules.movie_id = movies.id
                `
            )[0];
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀 Server พร้อมทำงานแล้วที่: ${url}`);
