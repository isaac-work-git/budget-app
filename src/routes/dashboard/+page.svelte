<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import ExpenseRow from '$lib/components/ExpenseRow.svelte';
	import ExpenseAddForm from '$lib/components/ExpenseAddForm.svelte';
	import NavBar from '$lib/components/NavBar.svelte';

	interface Props {
		data: PageServerData;
		form: any;
	}

	let { data }: Props = $props();
	let hiddenInput: HTMLInputElement;

	let items = $state([...(data.expenses ?? [])]);
	let expenseDraft = $state({ description: '', amount: '' });

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
</script>

<NavBar />

<h1 class="flex md:mt-15 md:mb-20">Hi, {data.user.username}!</h1>

<form method="post" action="?/logout" use:enhance>
	<button class="max-w-48 hover:bg-blue-500 hover:text-white active:bg-blue-600">Sign out</button>
</form>

<main>
	<section class="m-10 grid grid-cols-1 justify-center gap-10 md:grid-cols-3">
		<form method="POST" action="?/income" use:enhance class="flex flex-col">
			<span class="mb-6 rounded-xl bg-blue-500 p-4">
				<h1>Monthly Income</h1>
				{#if data.user.income}
					<p class="mb-2 rounded-lg bg-blue-300">{data.user.income}</p>
				{/if}

				<input
					name="income"
					type="text"
					placeholder="Enter amount"
					class="rounded-lg border-none bg-blue-300"
					oninput={(e) => {
						const input = e.target as HTMLInputElement;
						input.value = input.value.replace(/[^0-9.]/g, '');
					}}
					onblur={(e) => {
						const input = e.target as HTMLInputElement;
						const parsed = parseFloat(input.value.replace(/[^\d.]/g, ''));
						input.value = isNaN(parsed)
							? ''
							: new Intl.NumberFormat('en-US', {
									style: 'currency',
									currency: 'USD'
								}).format(parsed);
					}}
				/>
			</span>
			<button type="submit" class="max-w-48 hover:bg-blue-500 hover:text-white active:bg-blue-600"
				>Save</button
			>
		</form>

		<div class="rounded-xl bg-blue-500 p-4">
			<h1>Total Expenses</h1>
			<p id="currencyDisplay" class="rounded-lg bg-blue-300">0</p>
		</div>
		<div class="rounded-xl bg-blue-500 p-4">
			<h1>Balance Leftover</h1>
			<p id="currencyDisplay" class="rounded-lg bg-blue-300">0</p>
		</div>
	</section>

	<section class="m-10 flex gap-10">
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

		<form class="w-1/3 rounded-xl bg-blue-500 p-4">
			<h1>Grocery Tracker</h1>
			<p id="currencyDisplay" class="rounded-lg bg-blue-300">0</p>
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
