CREATE TABLE "public"."speaker" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, "user_id" uuid, "conference_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("conference_id") REFERENCES "public"."conferences"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE cascade ON DELETE cascade);
CREATE EXTENSION IF NOT EXISTS pgcrypto;
