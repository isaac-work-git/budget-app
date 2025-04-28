<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import NavBar from '$lib/components/NavBar.svelte';
	import GroceryRow from '$lib/components/GroceryRow.svelte';
	import { Input, Card } from 'svelte-5-ui-lib';
	import ExpenseTable from '$lib/components/ExpenseTable.svelte';
	import FunTable from '$lib/components/FunTable.svelte';

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

	let groceryItems = $state(
		(data.groceryItems ?? []).map((item) => {
			const [year, Month, _, weekNumber] = (item.id as string).split('-');
			const yearMonth = `${year}-${Month}`;
			return {
				...item,
				month: yearMonth,
				week: Number(weekNumber)
			};
		})
	);
</script>

<NavBar name={data.user.username} />

<h1 class="flex px-10 md:mt-15">Hello, {data.user.username}!</h1>
<h2 class="flex px-10 text-xl md:mb-20">Let's budget.</h2>

<main>
	<section class="m-10 grid grid-cols-1 justify-center gap-6 md:grid-cols-3">
		<Card>
			<form method="POST" action="?/income" class="flex flex-col gap-4 pb-4">
				<span class="mb-6">
					<h1 class="pb-4 dark:text-white">
						Monthly Income:
						{#if income}
							{new Intl.NumberFormat('en-US', {
								style: 'currency',
								currency: 'USD'
							}).format(income)}
						{/if}
					</h1>

					<Input
						name="income"
						type="text"
						placeholder="Enter amount"
						class="rounded-xl"
						oninput={(e) => {
							const input = e.target as HTMLInputElement;
							input.value = input.value.replace(/[^0-9.]/g, '');
						}}
					/>
				</span>
				<button
					type="submit"
					class="max-w-48 bg-white hover:bg-blue-500 hover:text-white active:bg-blue-600"
					>Save</button
				>
			</form>

			<div class="p-4 dark:text-white">
				<h1>
					Expenses:
					{new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: 'USD'
					}).format(total)}
				</h1>
			</div>
			<div class="p-4 dark:text-white">
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
		</Card>

		<Card shadow="xl" size="lg">
			<form class="flex flex-col gap-4 dark:text-white">
				<h1 class="col-span-3">Grocery Tracker</h1>
				<GroceryRow {groceryItems} />
			</form>
		</Card>
	</section>

	<section class="m-10 mb-25 flex gap-6">
		<Card shadow="xl" size="md">
			<form
				method="POST"
				action="?/add_expense"
				class="flex flex-col gap-4 p-4"
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
				<h1 class="col-span-2 dark:text-white">Expected Expenses</h1>

				<ExpenseTable />

				<!-- {#each items as item, i}
					<ExpenseRow {item} {i} />
				{/each} -->

				<!-- Input row to add new items -->
				<!-- <ExpenseAddForm draft={expenseDraft} onAdd={addRow} /> -->

				<!-- Hidden field to hold serialized data -->
				<input type="hidden" name="expenses" bind:this={hiddenInput} />

				<span class="flex justify-end gap-4">
					<button
						type="submit"
						class="rounded-lg bg-white px-6 py-2 hover:bg-blue-500 hover:text-white"
					>
						Save
					</button>
				</span>
			</form>
		</Card>

		<Card shadow="xl" size="md">
			<form class="flex flex-col gap-4">
				<h1 class="col-span-4 text-white">Fun Spending Report</h1>
				<FunTable groceryItems />
			</form>
		</Card>
	</section>
</main>

<style>
	h1,
	h2,
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
