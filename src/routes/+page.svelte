<script lang="ts">
	import { browser } from '$app/environment';
	import Item from './Item.svelte';
	import { Status } from '$lib';
	import { v4 as uuidv4 } from 'uuid';
	import type { Task } from '$lib';
	import { onMount } from 'svelte';

	let newItem = '';
	let newItemField: HTMLInputElement;
	let filter = '';
	let taskList: Task[] = getTasks();
	$: browser && localStorage.setItem('tasks', JSON.stringify(taskList));
	let selectedCategory = 0;
	$: filteredItems = taskList.filter((x) => x.name.toLowerCase().includes(filter.toLowerCase()) && (selectedCategory != 0 ? x.status == selectedCategory : true));
	let showMenu = false;
	let menu = null;

	function getTasks(): Task[] {
		if (!browser) {
			return [];
		}
		const storedTasks = localStorage.getItem('tasks');
		// If item exists, parse and return tasks
		if (storedTasks !== null) {
			try {
				return JSON.parse(storedTasks) as Task[];
			} catch (error) {
				console.error('Error parsing tasks from localStorage:', error);
				// Return empty array on parsing error
				return [];
			}
		}
		return [];
	}

	function addItem() {
		if (newItem.length < 1)
			return;
		if (taskList.find((x) => x.name === newItem)) {
			newItemField.value = '';
			return;
		}
		taskList = [...taskList, { id: uuidv4(), name: newItem, status: 1 }];
		newItemField.value = '';
	}

	function updateTask(event) {
		const { id, status } = event.detail;
		const task = taskList.find((task) => task.id === id)!;
		task.status = status;
		taskList = taskList;
	}

	function deleteTask(event) {
		const { id } = event.detail;
		taskList = taskList.filter((task) => task.id !== id);
	}

	function clickOutside(node) {
		// the node has been mounted in the DOM

		window.addEventListener('click', handleClick);

		function handleClick(e) {
			if (!node.contains(e.target)) {
				node.dispatchEvent(new CustomEvent('outsideclick'));
			}
		}

		return {
			destroy() {
				// the node has been removed from the DOM
				window.removeEventListener('click', handleClick);
			}
		};
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
<header class="bg-blue-500">
	<div class="flex justify-center items-center content-center flex-col gap-2 p-2">
		<span class="text-2xl text-white">Todo List</span>
		<div class="w-2/3">
			<form class="flex flex-row justify-between gap-2" on:submit|preventDefault={addItem}>
				<input class="rounded-md p-1.5 w-full" bind:this={newItemField} bind:value={newItem} type="text"
							 placeholder="Todo...">
				<button class="text-white bg-blue-700 px-2 rounded-md p-1.5 basis-1/4" type="submit">
					Add
				</button>
			</form>
		</div>
		<div class="flex flex-row w-2/3 gap-2">
			<input class="w-full rounded-md p-1.5" bind:value={filter} type="text" placeholder="Filter...">
			<div class="w-full">
				<button bind:this={menu}
								type="button"
								class="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
								id="menu-button" aria-expanded="true" aria-haspopup="true"
								on:click={()=>showMenu=!showMenu}>
					{Status[selectedCategory]}
					<svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path fill-rule="evenodd"
									d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
									clip-rule="evenodd" />
					</svg>
				</button>
				{#if showMenu}
					<div
						class="absolute z-10 mt-2 w-1/3 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-out duration-100"
						role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
						<div class="py-1 object-fill" role="none">
							{#each Status as state}
								<button class="text-gray-700 text-left block px-4 py-2 text-sm w-full" role="menuitem" tabindex="-1"
												on:click={()=>{selectedCategory=Status.indexOf(state); showMenu=!showMenu}}
								>
									{state}
								</button>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</header>
<div class="flex flex-col justify-center content-center p-4 gap-2">
	{#each filteredItems as todo}
		<Item {...todo} on:change={updateTask} on:delete={deleteTask} />
	{/each}
</div>
