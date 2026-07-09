<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faUserSecret, faLock, faArrowLeft, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';

	type Theme = 'light' | 'dark' | 'tea';

	let { data } = $props();
	let theme = $state<Theme>('light');

	$effect(() => {
		document.documentElement.setAttribute('data-theme', theme);
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
</script>

<div class="page-bg min-h-screen bg-gray-50 dark:bg-gray-950 tea:bg-slate-100 transition-colors duration-200">
	<header class="bg-white dark:bg-gray-900 tea:bg-slate-100 border-b border-gray-100 dark:border-gray-800 tea:border-slate-200">
		<div class="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
			<div class="flex items-center gap-2.5">
				<span class="text-violet-500 text-lg">
					<FontAwesomeIcon icon={faUserSecret} />
				</span>
				<a
					href="/"
					class="font-serif italic text-violet-600 text-xl font-semibold tracking-tight hover:text-violet-700 transition"
				>
					dark confessions
				</a>
			</div>
			<div class="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-600 tea:text-slate-400">
				<FontAwesomeIcon icon={faLock} class="text-gray-300 dark:text-gray-700 tea:text-slate-300" />
				<span>anonymous · no account needed</span>
			</div>
		</div>
	</header>

	<main class="max-w-3xl mx-auto px-4 py-10">
		<a
			href="/"
			class="inline-flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 tea:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 tea:hover:text-violet-600 transition mb-8"
		>
			<FontAwesomeIcon icon={faArrowLeft} />
			Back to confessions
		</a>

		<article class="bg-white dark:bg-gray-900 tea:bg-slate-50 rounded-2xl border border-gray-100 dark:border-gray-800 tea:border-slate-200 shadow-sm px-8 py-10 relative">
			<span class="absolute top-6 right-6 text-violet-100 dark:text-violet-900 tea:text-slate-200 text-4xl pointer-events-none">
				<FontAwesomeIcon icon={faQuoteLeft} />
			</span>

			{#if data.confession.title}
				<h1 class="font-serif font-semibold text-2xl text-gray-900 dark:text-gray-50 tea:text-slate-800 mb-4 pr-10">
					{data.confession.title}
				</h1>
			{/if}

			<p class="font-serif text-gray-700 dark:text-gray-300 tea:text-slate-700 text-lg leading-relaxed pr-10">
				{data.confession.body}
			</p>

			<time class="block mt-6 text-xs text-gray-400 dark:text-gray-600 tea:text-slate-400">
				{timeAgo(data.confession.createdAt)}
			</time>
		</article>
	</main>
</div>
