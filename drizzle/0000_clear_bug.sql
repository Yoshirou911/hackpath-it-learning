CREATE TABLE `user_progress` (
	`user_email` text PRIMARY KEY NOT NULL,
	`display_name` text,
	`state_json` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
