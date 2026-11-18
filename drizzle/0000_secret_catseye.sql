CREATE TABLE "dataset_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dataset_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"label" varchar(150) NOT NULL,
	"type" varchar(30) NOT NULL,
	"is_searchable" integer DEFAULT 1 NOT NULL,
	"is_filterable" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dataset_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dataset_id" uuid NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "datasets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(150) NOT NULL,
	"description" text,
	"category" varchar(100) NOT NULL,
	"data_source" varchar(150),
	"total_records" integer DEFAULT 0 NOT NULL,
	"owner_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(150) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text,
	"role" varchar(30) DEFAULT 'viewer' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "dataset_fields" ADD CONSTRAINT "dataset_fields_dataset_id_datasets_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dataset_records" ADD CONSTRAINT "dataset_records_dataset_id_datasets_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "datasets" ADD CONSTRAINT "datasets_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "dataset_fields_unique_idx" ON "dataset_fields" USING btree ("dataset_id","name");--> statement-breakpoint
CREATE INDEX "dataset_records_dataset_idx" ON "dataset_records" USING btree ("dataset_id");--> statement-breakpoint
CREATE INDEX "dataset_records_created_idx" ON "dataset_records" USING btree ("dataset_id","created_at");--> statement-breakpoint
CREATE INDEX "datasets_category_idx" ON "datasets" USING btree ("category");--> statement-breakpoint
CREATE INDEX "datasets_owner_idx" ON "datasets" USING btree ("owner_id");