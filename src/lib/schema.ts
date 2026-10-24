import {
  pgTable, serial, integer, text, boolean, timestamp, date, jsonb, customType, uniqueIndex,
} from "drizzle-orm/pg-core";

const bytea = customType<{ data: Uint8Array; driverData: Uint8Array }>({
  dataType: () => "bytea",
});

// Сум/дүүрэг — нэгдсэн сайтын эзэн. Нэг org дотор олон сургууль.
export const orgs = pgTable("orgs", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  heroKicker: text("hero_kicker").notNull().default("Боловсролтой ирээдүй"),
  heroTitle: text("hero_title").notNull(),
  heroText: text("hero_text").notNull().default(""),
  heroImageId: integer("hero_image_id"),
  about: text("about").notNull().default(""),
  address: text("address").notNull().default(""),
  phone: text("phone").notNull().default(""),
  email: text("email").notNull().default(""),
  facebook: text("facebook").notNull().default(""),
  eduUrl: text("edu_url").notNull().default("https://edu.zulzaga.app"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const schools = pgTable("schools", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").notNull(),
  slug: text("slug").notNull(),
  number: integer("number").notNull().default(0),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  tagline: text("tagline").notNull().default(""),
  about: text("about").notNull().default(""),
  directorName: text("director_name").notNull().default(""),
  directorMessage: text("director_message").notNull().default(""),
  directorPhotoId: integer("director_photo_id"),
  photoId: integer("photo_id"),
  photoPath: text("photo_path"),
  color: text("color").notNull().default("blue"),
  founded: integer("founded"),
  students: integer("students").notNull().default(0),
  teachers: integer("teachers").notNull().default(0),
  classes: integer("classes").notNull().default(0),
  address: text("address").notNull().default(""),
  phone: text("phone").notNull().default(""),
  email: text("email").notNull().default(""),
  facebook: text("facebook").notNull().default(""),
  admission: text("admission").notNull().default(""),
  clubs: jsonb("clubs").$type<string[]>().notNull().default([]),
  sort: integer("sort").notNull().default(0),
}, (t) => [uniqueIndex("schools_org_slug").on(t.orgId, t.slug)]);

// Домэйн → org (+ сонголтоор тодорхой сургууль). Сургууль өөрийн домэйноо өгөхөд энд нэг мөр нэмэгдэнэ.
export const domains = pgTable("domains", {
  host: text("host").primaryKey(),
  orgId: integer("org_id").notNull(),
  schoolId: integer("school_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").notNull(),
  schoolId: integer("school_id"),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  coverId: integer("cover_id"),
  category: text("category").notNull().default("medee"),
  published: boolean("published").notNull().default(true),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").notNull(),
  schoolId: integer("school_id"),
  title: text("title").notNull(),
  startsOn: date("starts_on").notNull(),
  endsOn: date("ends_on"),
  place: text("place").notNull().default(""),
  description: text("description").notNull().default(""),
  kind: text("kind").notNull().default("event"),
});

export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  group: text("group").notNull().default("bagsh"),
  subject: text("subject").notNull().default(""),
  photoId: integer("photo_id"),
  sort: integer("sort").notNull().default(0),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").notNull(),
  schoolId: integer("school_id"),
  category: text("category").notNull(),
  title: text("title").notNull(),
  fileId: integer("file_id"),
  publishedOn: date("published_on").notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").notNull(),
  schoolId: integer("school_id"),
  kind: text("kind").notNull().default("sanal"),
  name: text("name").notNull().default(""),
  contact: text("contact").notNull().default(""),
  body: text("body").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").notNull(),
  name: text("name").notNull(),
  mime: text("mime").notNull(),
  size: integer("size").notNull(),
  data: bytea("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// schoolId null = сумын админ (бүх сургуулийг удирдана)
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").notNull(),
  schoolId: integer("school_id"),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
});

export type Org = typeof orgs.$inferSelect;
export type School = typeof schools.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Staff = typeof staff.$inferSelect;
export type Doc = typeof documents.$inferSelect;
export type Message = typeof messages.$inferSelect;
