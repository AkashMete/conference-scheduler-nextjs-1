alter table "public"."tickets" drop constraint "tickets_email_conference_id_key";
alter table "public"."tickets" add constraint "tickets_email_key" unique ("email");
