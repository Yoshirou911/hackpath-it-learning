import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const userProgress = sqliteTable('user_progress', {
  userEmail: text('user_email').primaryKey(),
  displayName: text('display_name'),
  stateJson: text('state_json').notNull(),
  version: integer('version').notNull().default(1),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})
