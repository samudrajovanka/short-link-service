CREATE TABLE "short-links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"slug" varchar NOT NULL,
	"original_url" varchar NOT NULL,
	"total_access" integer DEFAULT 0,
	CONSTRAINT "short-links_slug_unique" UNIQUE("slug")
);
