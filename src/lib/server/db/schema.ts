import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const confessions = sqliteTable('confessions', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	title: text('title'),
	body: text('body').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`)
});
