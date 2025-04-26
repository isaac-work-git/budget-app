<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import ExpenseRow from '$lib/components/ExpenseRow.svelte';
	import ExpenseAddForm from '$lib/components/ExpenseAddForm.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import GroceryRow from '$lib/components/GroceryRow.svelte';

	interface Props {
		data: PageServerData;
		form: any;
	}

	let { data }: Props = $props();
	let hiddenInput: HTMLInputElement;

	let items = $state([...(data.expenses ?? [])]);
	let expenseDraft = $state({ description: '', amount: '' });
	let total = $derived.by(() => {
		return items.reduce((sum, item) => sum + item.amount, 0);
	});
	let income = $state(0);

	if (typeof data.user.income === 'number') {
		income = data.user.income;
	} else if (typeof data.user.income === 'string') {
		income = parseFloat(data.user.income);
	} else {
		income = 0;
	}

	let balance = $derived(income - total);

	function addRow(row: { description: string; amount: number }) {
		items = [...items, row];
	}

	function deleteRow(index: number) {
		items = items.toSpliced(index, 1); // OR use slice/splice combo
		console.log('Deleting row...\n');
	}

	// Sync hidden input with the serialized `items`
	$effect(() => {
		if (hiddenInput) hiddenInput.value = JSON.stringify(items);
	});

	// Helper to get the current month in "YYYY-MM" format
	function getCurrentMonth() {
		const now = new Date();
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
	}

	let groceryItems = $state<{ week: number; amount: number | null; month: string }[]>([
		{ week: 1, amount: null, month: getCurrentMonth() },
		{ week: 2, amount: null, month: getCurrentMonth() },
		{ week: 3, amount: null, month: getCurrentMonth() },
		{ week: 4, amount: null, month: getCurrentMonth() },
		{ week: 5, amount: null, month: getCurrentMonth() }
	]);

	let groceryTotal = $derived.by(() => {
		return groceryItems.reduce((sum, item) => sum + (item.amount ?? 0), 0);
	});
</script>

<NavBar />

<h1 class="flex px-10 md:mt-15 md:mb-20">Hi, {data.user.username}!</h1>

<main>
	<section class="m-10 grid grid-cols-1 justify-center gap-6 md:grid-cols-3">
		<form method="POST" action="?/income" class="flex flex-col">
			<span class="mb-6 rounded-xl bg-blue-500 p-4">
				<h1>
					Monthly Income:
					{#if income}
						{new Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: 'USD'
						}).format(income)}
					{/if}
				</h1>

				<input
					name="income"
					type="text"
					placeholder="Enter amount"
					class="rounded-lg border-none bg-blue-300"
					oninput={(e) => {
						const input = e.target as HTMLInputElement;
						input.value = input.value.replace(/[^0-9.]/g, '');
					}}
				/>
			</span>
			<button type="submit" class="max-w-48 hover:bg-blue-500 hover:text-white active:bg-blue-600"
				>Save</button
			>
		</form>

		<div class="h-min rounded-xl bg-blue-500 p-4">
			<h1>
				Expenses:
				{new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD'
				}).format(total)}
			</h1>
		</div>
		<div class="h-min rounded-xl bg-blue-500 p-4">
			<h1>
				Balance:&nbsp;
				<span class={`${balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
					{new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: 'USD'
					}).format(balance)}
				</span>
			</h1>
		</div>
	</section>

	<section class="m-10 flex gap-6">
		<form
			method="POST"
			action="?/add_expense"
			class="flex w-1/3 flex-col gap-4 rounded-xl bg-blue-500 p-4"
			onsubmit={(e) => {
				// Before submit, auto-push draft row if filled
				if (expenseDraft.description || expenseDraft.amount) {
					addRow({
						description: expenseDraft.description,
						amount: parseFloat(expenseDraft.amount)
					});
					expenseDraft.description = '';
					expenseDraft.amount = '';
				}
			}}
		>
			<h1 class="col-span-2 text-white">Expected Expenses</h1>

			{#each items as item, i}
				<ExpenseRow {item} {i} onDelete={deleteRow} />
			{/each}

			<!-- Input row to add new items -->
			<ExpenseAddForm draft={expenseDraft} onAdd={addRow} />

			<!-- Hidden field to hold serialized data -->
			<input type="hidden" name="expenses" bind:this={hiddenInput} />

			<span class="flex justify-end gap-4">
				<button type="submit" class="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
					Save
				</button>
			</span>
		</form>

		<form class="flex w-1/3 flex-col gap-4 rounded-xl bg-blue-500 p-4">
			<h1 class="col-span-3 text-white">Grocery Tracker</h1>
			<div class="flex flex-row">
				<h1 class="w-1/3 justify-center">Week</h1>
				<h1 class="w-1/3 justify-center">Amount</h1>
				<h1 class="w-1/3 justify-center">Month</h1>
			</div>

			{#each groceryItems as groceryItem, i}
				<GroceryRow bind:groceryItem={groceryItems[i]} />
			{/each}

			<!-- Total row -->
			<div class="mt-4 grid grid-cols-3 border-t border-black pt-2 text-center font-semibold">
				<p>Total</p>
				<p>
					{new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: 'USD'
					}).format(groceryTotal)}
				</p>
				<p></p>
			</div>
		</form>
		<form class="w-1/3 rounded-xl bg-blue-500 p-4">
			<h1>Fun Spending Report</h1>
			<p id="currencyDisplay" class="rounded-lg bg-blue-300">0</p>
		</form>
	</section>
</main>

<style>
	h1,
	p,
	form {
		display: flex;
		/* padding: 0 0 0 2rem; */
	}
	button {
		display: flex;
		border-radius: 10px;
		border: 2px solid black;
		padding: calc(var(--spacing) * 4);
		width: 100%;
		align-self: center;
	}
</style>
