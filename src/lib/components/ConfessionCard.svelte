<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';

	let { id, title, text, time }: { id: string; title?: string; text: string; time: string } = $props();
</script>

<a
	href="/{id}"
	class="group block bg-white dark:bg-gray-900 tea:bg-slate-50 rounded-xl border border-gray-100 dark:border-gray-800 tea:border-slate-200 px-5 py-5 relative transition-colors duration-200 hover:border-violet-200 dark:hover:border-violet-800 tea:hover:border-violet-200 hover:shadow-sm"
>
	<span class="absolute top-4 right-4 text-violet-100 dark:text-violet-900 tea:text-slate-200 text-2xl pointer-events-none transition group-hover:text-violet-200 dark:group-hover:text-violet-800">
		<FontAwesomeIcon icon={faQuoteLeft} />
	</span>
	{#if title}
		<p class="font-serif font-semibold text-gray-900 dark:text-gray-100 tea:text-slate-800 text-sm mb-1 pr-8">{title}</p>
	{/if}
	<p class="font-serif text-gray-700 dark:text-gray-300 tea:text-slate-700 text-base leading-relaxed pr-8 line-clamp-3">{text}</p>
	<time class="text-xs text-gray-400 dark:text-gray-600 tea:text-slate-400 mt-3 block">{time}</time>
</a>
