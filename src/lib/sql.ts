// Хүснэгтүүд — src/lib/schema.ts-тэй ижил байх ёстой. Бүгд IF NOT EXISTS тул дахин ажиллуулахад аюулгүй.
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS orgs (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  hero_kicker text NOT NULL DEFAULT 'Боловсролтой ирээдүй',
  hero_title text NOT NULL,
  hero_text text NOT NULL DEFAULT '',
  hero_image_id integer,
  about text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  facebook text NOT NULL DEFAULT '',
  edu_url text NOT NULL DEFAULT 'https://edu.zulzaga.app',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS schools (
  id serial PRIMARY KEY,
  org_id integer NOT NULL,
  slug text NOT NULL,
  number integer NOT NULL DEFAULT 0,
  name text NOT NULL,
  short_name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  about text NOT NULL DEFAULT '',
  director_name text NOT NULL DEFAULT '',
  director_message text NOT NULL DEFAULT '',
  director_photo_id integer,
  photo_id integer,
  photo_path text,
  color text NOT NULL DEFAULT 'blue',
  founded integer,
  students integer NOT NULL DEFAULT 0,
  teachers integer NOT NULL DEFAULT 0,
  classes integer NOT NULL DEFAULT 0,
  address text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  facebook text NOT NULL DEFAULT '',
  admission text NOT NULL DEFAULT '',
  clubs jsonb NOT NULL DEFAULT '[]',
  sort integer NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX IF NOT EXISTS schools_org_slug ON schools (org_id, slug);
CREATE TABLE IF NOT EXISTS domains (
  host text PRIMARY KEY,
  org_id integer NOT NULL,
  school_id integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS posts (
  id serial PRIMARY KEY,
  org_id integer NOT NULL,
  school_id integer,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  cover_id integer,
  category text NOT NULL DEFAULT 'medee',
  published boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS posts_org_time ON posts (org_id, published_at DESC);
CREATE TABLE IF NOT EXISTS events (
  id serial PRIMARY KEY,
  org_id integer NOT NULL,
  school_id integer,
  title text NOT NULL,
  starts_on date NOT NULL,
  ends_on date,
  place text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  kind text NOT NULL DEFAULT 'event'
);
CREATE TABLE IF NOT EXISTS staff (
  id serial PRIMARY KEY,
  school_id integer NOT NULL,
  name text NOT NULL,
  position text NOT NULL,
  "group" text NOT NULL DEFAULT 'bagsh',
  subject text NOT NULL DEFAULT '',
  photo_id integer,
  sort integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS documents (
  id serial PRIMARY KEY,
  org_id integer NOT NULL,
  school_id integer,
  category text NOT NULL,
  title text NOT NULL,
  file_id integer,
  published_on date NOT NULL
);
CREATE TABLE IF NOT EXISTS messages (
  id serial PRIMARY KEY,
  org_id integer NOT NULL,
  school_id integer,
  kind text NOT NULL DEFAULT 'sanal',
  name text NOT NULL DEFAULT '',
  contact text NOT NULL DEFAULT '',
  body text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS files (
  id serial PRIMARY KEY,
  org_id integer NOT NULL,
  name text NOT NULL,
  mime text NOT NULL,
  size integer NOT NULL,
  data bytea NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS admins (
  id serial PRIMARY KEY,
  org_id integer NOT NULL,
  school_id integer,
  username text NOT NULL UNIQUE,
  name text NOT NULL,
  password_hash text NOT NULL
);
`;
