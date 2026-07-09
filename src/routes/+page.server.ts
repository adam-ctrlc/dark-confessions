import { db } from '$lib/server/db';
import { confessions } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { desc, asc, or, like, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

const PAGE_SIZE = 6;

export const load: PageServerLoad = async ({ url }) => {
	const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
	const q = url.searchParams.get('q')?.trim() ?? '';
	const sort = url.searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest';

	const where = q
		? or(like(confessions.title, `%${q}%`), like(confessions.body, `%${q}%`))
		: undefined;

	const order = sort === 'oldest' ? asc(confessions.createdAt) : desc(confessions.createdAt);

	const [rows, [{ total }]] = await Promise.all([
		db
			.select()
			.from(confessions)
			.where(where)
			.orderBy(order)
			.limit(PAGE_SIZE)
			.offset((page - 1) * PAGE_SIZE),
		db
			.select({ total: sql<number>`count(*)` })
			.from(confessions)
			.where(where)
	]);

	return {
		confessions: rows,
		page,
		totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
		q,
		sort
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const honeypot = data.get('website');
		if (honeypot) return { success: true };

		const title = (data.get('confession-title') as string)?.trim() || null;
		const body = (data.get('confession') as string)?.trim();

		if (!body || body.length < 2) {
			return fail(422, { error: 'Confession is too short.' });
		}

		if (body.length > 500) {
			return fail(422, { error: 'Confession exceeds 500 characters.' });
		}

		await db.insert(confessions).values({ title, body });

		return { success: true };
	}
};
