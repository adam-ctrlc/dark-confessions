import { db } from '$lib/server/db';
import { confessions } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;
	const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	if (!uuidPattern.test(id)) error(404, 'Not found');

	const [confession] = await db
		.select()
		.from(confessions)
		.where(eq(confessions.id, id))
		.limit(1);

	if (!confession) error(404, 'Confession not found');

	return { confession };
};
