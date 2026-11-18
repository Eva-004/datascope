
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password"),
  role: varchar("role", { length: 30 }).notNull().default("viewer"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const datasets = pgTable(
  "datasets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 150 }).notNull(),
    description: text("description"),
    category: varchar("category", { length: 100 }).notNull(),
    dataSource: varchar("data_source", { length: 150 }),
    totalRecords: integer("total_records").notNull().default(0),
    ownerId: uuid("owner_id").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("datasets_category_idx").on(table.category),
    index("datasets_owner_idx").on(table.ownerId),
  ]
);

export const datasetFields = pgTable(
  "dataset_fields",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    datasetId: uuid("dataset_id")
      .notNull()
      .references(() => datasets.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    label: varchar("label", { length: 150 }).notNull(),
    type: varchar("type", { length: 30 }).notNull(),
    isSearchable: integer("is_searchable").notNull().default(1),
    isFilterable: integer("is_filterable").notNull().default(1),
  },
  (table) => [
    uniqueIndex("dataset_fields_unique_idx").on(
      table.datasetId,
      table.name
    ),
  ]
);

export const datasetRecords = pgTable(
  "dataset_records",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    datasetId: uuid("dataset_id")
      .notNull()
      .references(() => datasets.id, { onDelete: "cascade" }),
    data: jsonb("data").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("dataset_records_dataset_idx").on(table.datasetId),
    index("dataset_records_created_idx").on(
      table.datasetId,
      table.createdAt
    ),
  ]
);
