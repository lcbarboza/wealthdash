CREATE TABLE `assets` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`ticker` text,
	`asset_type` text NOT NULL,
	`asset_class` text NOT NULL,
	`sector` text,
	`currency` text DEFAULT 'BRL' NOT NULL,
	`maturity_date` text,
	`rate_type` text,
	`indexer` text,
	`rate_value` real,
	`notes` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_assets_ticker` ON `assets`(`ticker`) WHERE `ticker` IS NOT NULL;
