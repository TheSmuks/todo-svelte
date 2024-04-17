<script lang="ts">
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';
	import { Status } from '$lib';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let id: string;
	export let name: string;
	export let status: number;
	let showMenu = false;
	let menu = null;

	function updateTask(statusId: number) {
		dispatch('change', { id, status: statusId });
		showMenu = false;
	}

	function deleteTask() {
		dispatch('delete', { id });
	}

	onMount(() => {
		const handleOutsideClick = (event) => {
			if (showMenu && !menu.contains(event.target)) {
				showMenu = false;
			}
		};

		const handleEscape = (event) => {
			if (showMenu && event.key === 'Escape') {
				showMenu = false;
			}
		};

		// add events when element is added to the DOM
		document.addEventListener('click', handleOutsideClick, false);
		document.addEventListener('keyup', handleEscape, false);

		// remove events when element is removed from the DOM
		return () => {
			document.removeEventListener('click', handleOutsideClick, false);
			document.removeEventListener('keyup', handleEscape, false);
		};
	});

</script>
<div class="flex flex-row gap-4 grow">
	<div class="w-4/6 flex flex-row gap-4">
		<div class="flex items-center{status===2?' line-through':''} w-full ring-1 ring-gray-300 rounded-md shadow-lg px-2">
			<span class="{status===2?'opacity-50':''}">{name}</span>
		</div>
	</div>
	<div class="w-2/6">
		<button bind:this={menu} type="button"
						class="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
						id="menu-button" aria-expanded="true" aria-haspopup="true"
						on:click={()=>showMenu=!showMenu}>
			{Status[status]}
			<svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				<path fill-rule="evenodd"
							d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
							clip-rule="evenodd" />
			</svg>
		</button>
		{#if showMenu}
			<div
				in:scale={{ duration: 100, start: 0.95 }}
				out:scale={{ duration: 75, start: 0.95 }}
				class="absolute z-10 mt-2 w-1/3 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-xl ring-2 ring-black ring-opacity-5 focus:outline-none transition ease-out duration-100"
				role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
				<div class="py-1 object-fill" role="none">
					{#each Status.slice(1) as state}
						<button class="text-gray-700 text-left block px-4 py-2 text-sm w-full" role="menuitem" tabindex="-1"
										on:click={()=>updateTask(Status.indexOf(state))}
						>
							{state}
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
	<div>
		<button
			class="inline-flex w-full justify-between gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-red-600 bg-red-600 text-white"
			on:click={deleteTask}>
			X
		</button>
	</div>
</div>