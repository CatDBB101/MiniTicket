export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: unknown; output: unknown; }
};

export type Movie = {
  __typename?: 'Movie';
  genre?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type MovieFilter = {
  genre?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createReserve?: Maybe<Reserve>;
  createSchedule?: Maybe<Schedule>;
  deleteReserve?: Maybe<Reserve>;
  deleteSchedule?: Maybe<Schedule>;
};


export type MutationCreateReserveArgs = {
  schedule_id: Scalars['Int']['input'];
  seat_number: Scalars['Int']['input'];
};


export type MutationCreateScheduleArgs = {
  movie_id: Scalars['Int']['input'];
  showtime?: InputMaybe<Scalars['DateTime']['input']>;
  theatre: Scalars['Int']['input'];
};


export type MutationDeleteReserveArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteScheduleArgs = {
  id: Scalars['Int']['input'];
};

export type Query = {
  __typename?: 'Query';
  movies?: Maybe<Array<Maybe<Movie>>>;
  reserves?: Maybe<Array<Maybe<Reserve>>>;
  schedules?: Maybe<Array<Maybe<Schedule>>>;
};


export type QueryMoviesArgs = {
  filter?: InputMaybe<MovieFilter>;
};


export type QueryReservesArgs = {
  filter?: InputMaybe<ReserveFilter>;
};


export type QuerySchedulesArgs = {
  filter?: InputMaybe<ScheduleFilter>;
};

export type Reserve = {
  __typename?: 'Reserve';
  genre?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  movie_id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  schedule_id?: Maybe<Scalars['Int']['output']>;
  seat_number?: Maybe<Scalars['Int']['output']>;
  showtime?: Maybe<Scalars['DateTime']['output']>;
  theatre?: Maybe<Scalars['Int']['output']>;
};

export type ReserveFilter = {
  genre?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  movie_id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  schedule_id?: InputMaybe<Scalars['Int']['input']>;
  seat_number?: InputMaybe<Scalars['Int']['input']>;
  theatre?: InputMaybe<Scalars['Int']['input']>;
};

export type Schedule = {
  __typename?: 'Schedule';
  genre?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  movie_id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  showtime?: Maybe<Scalars['DateTime']['output']>;
  theatre?: Maybe<Scalars['Int']['output']>;
};

export type ScheduleFilter = {
  genre?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  movie_id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  theatre?: InputMaybe<Scalars['Int']['input']>;
};
