<script lang="ts">
	import ConfessionCard from '$lib/components/ConfessionCard.svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import {
		faUserSecret,
		faLock,
		faPaperPlane,
		faComments,
		faCircleCheck,
		faChevronLeft,
		faChevronRight,
		faSun,
		faMoon,
		faMugHot,
		faTag,
		faMagnifyingGlass
	} from '@fortawesome/free-solid-svg-icons';

	type Theme = 'light' | 'dark' | 'tea';

	const MAX = 500;

	let { data, form } = $props();

	let title = $state('');
	let text = $state('');
	let honeypot = $state('');
	let submitting = $state(false);
	let successVisible = $state(false);
	let theme = $state<Theme>('light');

	const pageNumbers = $derived(
		Array.from({ length: data.totalPages }, (_, i) => i + 1)
	);

	let searchValue = $state(data.q);
	let searchTimer: ReturnType<typeof setTimeout>;

	$effect(() => {
		searchValue = data.q;
	});

	function onSearchInput(e: Event) {
		clearTimeout(searchTimer);
		const q = (e.target as HTMLInputElement).value;
		searchTimer = setTimeout(() => {
			const params = new URLSearchParams();
			if (q.trim()) params.set('q', q.trim());
			params.set('sort', data.sort);
			goto(`?${params}`);
		}, 400);
	}

	function setSort(sort: string) {
		const params = new URLSearchParams();
		if (data.q) params.set('q', data.q);
		params.set('sort', sort);
		goto(`?${params}`);
	}

	const themeButtons: { key: Theme; icon: typeof faSun; label: string }[] = [
		{ key: 'light', icon: faSun, label: 'Light' },
		{ key: 'dark', icon: faMoon, label: 'Dark' },
		{ key: 'tea', icon: faMugHot, label: 'Tea' }
	];

	$effect(() => {
		document.documentElement.setAttribute('data-theme', theme);
	});

	$effect(() => {
		if (form?.success) {
			title = '';
			text = '';
			successVisible = true;
			const t = setTimeout(() => (successVisible = false), 3500);
			return () => clearTimeout(t);
		}
	});

	function timeAgo(date: Date): string {
		const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
		if (seconds < 60) return 'just now';
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return `${minutes} min ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours} hr ago`;
		const days = Math.floor(hours / 24);
		return `${days} day${days === 1 ? '' : 's'} ago`;
	}

	function goToPage(page: number) {
		if (page < 1 || page > data.totalPages) return;
		const params = new URLSearchParams();
		if (data.q) params.set('q', data.q);
		params.set('sort', data.sort);
		params.set('page', String(page));
		goto(`?${params}`);
	}
</script>

<div class="page-bg min-h-screen bg-gray-50 dark:bg-gray-950 tea:bg-slate-100 transition-colors duration-200">
	<header class="bg-white dark:bg-gray-900 tea:bg-slate-100 border-b border-gray-100 dark:border-gray-800 tea:border-slate-200">
		<div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
			<div class="flex items-center gap-2.5">
				<span class="text-violet-500 text-lg">
					<FontAwesomeIcon icon={faUserSecret} />
				</span>
				<span class="font-serif italic text-violet-600 text-xl font-semibold tracking-tight">
					dark confessions
				</span>
			</div>

			<div class="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 tea:bg-slate-200 rounded-xl p-1">
				{#each themeButtons as btn}
					<button
						onclick={() => (theme = btn.key)}
						title={btn.label}
						class="w-8 h-8 flex items-center justify-center rounded-lg text-sm transition cursor-pointer"
						class:bg-white={btn.key === theme && theme === 'light'}
						class:bg-gray-700={btn.key === theme && theme === 'dark'}
						class:bg-slate-50={btn.key === theme && theme === 'tea'}
						class:text-violet-600={btn.key === theme}
						class:shadow-sm={btn.key === theme}
						class:text-gray-400={btn.key !== theme && theme === 'light'}
						class:text-gray-500={btn.key !== theme && theme === 'dark'}
						class:text-slate-400={btn.key !== theme && theme === 'tea'}
					>
						<FontAwesomeIcon icon={btn.icon} />
					</button>
				{/each}
			</div>

			<div class="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-600 tea:text-slate-400">
				<FontAwesomeIcon icon={faLock} class="text-gray-300 dark:text-gray-700 tea:text-slate-300" />
				<span>anonymous · no account needed</span>
			</div>
		</div>
	</header>

	<main class="max-w-4xl mx-auto px-4 py-10 space-y-8">
		<form
			method="POST"
			class="max-w-2xl mx-auto bg-white dark:bg-gray-900 tea:bg-slate-50 rounded-2xl border border-gray-100 dark:border-gray-800 tea:border-slate-200 shadow-sm"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					submitting = false;
					await update();
				};
			}}
		>
			<div class="px-8 py-8">
				<h1 class="font-serif text-3xl text-gray-900 dark:text-gray-50 tea:text-slate-800 mb-1">
					What's on your mind?
				</h1>
				<p class="text-sm text-gray-400 dark:text-gray-500 tea:text-slate-500 mb-6 flex items-center gap-1.5">
					<FontAwesomeIcon icon={faLock} class="text-violet-300" />
					Speak freely. Your confession is posted anonymously.
				</p>

				<div class="relative mb-3">
					<span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 tea:text-slate-300 text-sm pointer-events-none">
						<FontAwesomeIcon icon={faTag} />
					</span>
					<input
						id="confession-title"
						name="confession-title"
						type="text"
						bind:value={title}
						placeholder="Give it a title..."
						maxlength={80}
						class="w-full rounded-xl border border-gray-200 dark:border-gray-700 tea:border-slate-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900/30 pl-10 pr-4 py-3 font-serif text-base bg-white dark:bg-gray-800 tea:bg-white text-gray-800 dark:text-gray-100 tea:text-slate-800 placeholder-gray-300 dark:placeholder-gray-600 tea:placeholder-slate-400 outline-none transition"
					/>
				</div>

				<textarea
					id="confession"
					name="confession"
					bind:value={text}
					placeholder="Start typing your confession..."
					maxlength={MAX}
					rows={6}
					class="w-full resize-none rounded-xl border border-gray-200 dark:border-gray-700 tea:border-slate-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900/30 p-4 font-serif text-base bg-white dark:bg-gray-800 tea:bg-white text-gray-800 dark:text-gray-100 tea:text-slate-800 placeholder-gray-300 dark:placeholder-gray-600 tea:placeholder-slate-400 leading-relaxed outline-none transition"
				></textarea>

				<div class="absolute -left-[9999px] -top-[9999px]" aria-hidden="true">
					<label for="website">Website</label>
					<input
						id="website"
						name="website"
						type="text"
						bind:value={honeypot}
						tabindex="-1"
						autocomplete="off"
					/>
				</div>

				{#if form?.error}
					<p class="mt-2 text-xs text-red-500">{form.error}</p>
				{/if}

				<div class="flex items-center justify-between mt-3">
					<span
						class="text-xs tabular-nums"
						class:text-amber-500={text.length > MAX - 50}
						class:text-gray-400={text.length <= MAX - 50 && theme === 'light'}
						class:text-gray-500={text.length <= MAX - 50 && theme === 'dark'}
						class:text-slate-400={text.length <= MAX - 50 && theme === 'tea'}
					>
						{text.length}/{MAX}
					</span>
					<button
						type="submit"
						disabled={!text.trim() || submitting}
						class="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
					>
						<FontAwesomeIcon icon={faPaperPlane} />
						{submitting ? 'Posting...' : 'Confess'}
					</button>
				</div>
			</div>
		</form>

		{#if successVisible}
			<div class="max-w-2xl mx-auto flex items-center gap-3 bg-violet-50 dark:bg-violet-950 tea:bg-violet-50 border border-violet-200 dark:border-violet-900 tea:border-violet-200 rounded-xl px-5 py-4 text-sm text-violet-700 dark:text-violet-300 tea:text-violet-700">
				<FontAwesomeIcon icon={faCircleCheck} class="text-violet-500 text-base shrink-0" />
				Your confession has been shared anonymously.
			</div>
		{/if}

		<div class="flex flex-col sm:flex-row gap-3">
			<div class="relative flex-1">
				<span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 tea:text-slate-300 text-sm pointer-events-none">
					<FontAwesomeIcon icon={faMagnifyingGlass} />
				</span>
				<input
					id="confession-search"
					name="q"
					type="search"
					value={searchValue}
					oninput={onSearchInput}
					placeholder="Search confessions..."
					class="w-full rounded-xl border border-gray-200 dark:border-gray-700 tea:border-slate-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900/30 pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-900 tea:bg-slate-50 text-gray-800 dark:text-gray-100 tea:text-slate-800 placeholder-gray-300 dark:placeholder-gray-600 tea:placeholder-slate-400 outline-none transition"
				/>
			</div>
			<div class="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 tea:bg-slate-200 rounded-xl p-1 self-start sm:self-auto">
				{#each [['newest', 'Newest'], ['oldest', 'Oldest']] as [key, label]}
					<button
						onclick={() => setSort(key)}
						class="px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
						class:bg-white={data.sort === key && theme === 'light'}
						class:bg-gray-700={data.sort === key && theme === 'dark'}
						class:bg-slate-50={data.sort === key && theme === 'tea'}
						class:text-violet-600={data.sort === key}
						class:shadow-sm={data.sort === key}
						class:text-gray-400={data.sort !== key && theme === 'light'}
						class:text-gray-500={data.sort !== key && theme === 'dark'}
						class:text-slate-400={data.sort !== key && theme === 'tea'}
					>
						{label}
					</button>
				{/each}
			</div>
		</div>

		<section>
			<h2 class="flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-gray-600 tea:text-slate-400 uppercase tracking-wider mb-4">
				<FontAwesomeIcon icon={faComments} />
				Recent confessions
			</h2>

			{#if data.confessions.length === 0}
				<p class="text-center text-sm text-gray-400 dark:text-gray-600 tea:text-slate-400 py-12">
					No confessions yet. Be the first.
				</p>
			{:else}
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{#each data.confessions as c (c.id)}
						<ConfessionCard
							id={c.id}
							title={c.title ?? undefined}
							text={c.body}
							time={timeAgo(c.createdAt)}
						/>
					{/each}
				</div>

				{#if data.totalPages > 1}
					<div class="flex items-center justify-center gap-1 mt-6">
						<button
							onclick={() => goToPage(data.page - 1)}
							disabled={data.page === 1}
							class="px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 tea:text-slate-500 hover:bg-gray-200 dark:hover:bg-gray-800 tea:hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
						>
							<FontAwesomeIcon icon={faChevronLeft} />
						</button>

						{#each pageNumbers as page (page)}
							<button
								onclick={() => goToPage(page)}
								class="w-9 h-9 rounded-lg text-sm font-medium transition cursor-pointer"
								class:bg-violet-600={data.page === page}
								class:text-white={data.page === page}
								class:text-gray-500={data.page !== page && theme === 'light'}
								class:text-gray-400={data.page !== page && theme === 'dark'}
								class:text-slate-500={data.page !== page && theme === 'tea'}
								class:hover:bg-gray-200={data.page !== page && theme === 'light'}
								class:hover:bg-gray-800={data.page !== page && theme === 'dark'}
								class:hover:bg-slate-200={data.page !== page && theme === 'tea'}
							>
								{page}
							</button>
						{/each}

						<button
							onclick={() => goToPage(data.page + 1)}
							disabled={data.page === data.totalPages}
							class="px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 tea:text-slate-500 hover:bg-gray-200 dark:hover:bg-gray-800 tea:hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
						>
							<FontAwesomeIcon icon={faChevronRight} />
						</button>
					</div>
				{/if}
			{/if}
		</section>
	</main>
</div>
