<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import NavBar from '$lib/components/NavBar.svelte';
	import GroceryRow from '$lib/components/GroceryRow.svelte';
	import { Input, Card } from 'svelte-5-ui-lib';
	import ExpenseTable from '$lib/components/ExpenseTable.svelte';

	interface Props {
		data: PageServerData;
		form: any;
	}

	let { data }: Props = $props();
	let hiddenInput: HTMLInputElement;

	let items = $state(
		(data.expenses ?? []).map((item) => ({
			description: item.description,
			estimatedAmount: item.amount ?? 0, // original "amount" becomes "estimated"
			actualAmount: item.actualAmount ?? 0 // new actualAmount starts at 0
		}))
	);
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
		<Card shadow="xl" size="md">
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
		<Card shadow="xl" size="xl">
			<form method="POST" action="?/add_expense" class="flex flex-col gap-4 p-4">
				<h1 class="col-span-2 dark:text-white">Expected Expenses</h1>
				<ExpenseTable bind:items />
				<!-- Hidden field to hold serialized data -->
				<input type="hidden" name="expenses" bind:this={hiddenInput} />
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
