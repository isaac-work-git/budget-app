<script lang="ts">
	import type { PageServerData } from './$types';
	import NavBar from '$lib/components/NavBar.svelte';
	import GroceryRow from '$lib/components/GroceryRow.svelte';
	import { Card } from 'svelte-5-ui-lib';
	import ExpenseTable from '$lib/components/ExpenseTable.svelte';
	import IncomeCard from '$lib/components/IncomeCard.svelte';

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

	let income = $state(0);

	if (typeof data.user.income === 'number') {
		income = data.user.income;
	} else if (typeof data.user.income === 'string') {
		income = parseFloat(data.user.income);
	} else {
		income = 0;
	}

	// let balance = $derived(income - total);

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

	let groceryTotal = $state(0);

	$effect(() => {
		const groceriesRow = items.find((item) => item.description === 'Groceries');
		if (groceriesRow) {
			groceriesRow.actualAmount = groceryTotal;
		}
	});
</script>

<NavBar name={data.user.username} />

<section id="top" class="m-10 mt-20 flex gap-6">
	<IncomeCard name={data.user.username} bind:income />
</section>

<section id="groceries-graph" class="m-10 grid grid-cols-1 justify-center md:grid-cols-3">
	<Card shadow="xl" size="lg">
		<div class="flex flex-col gap-4 dark:text-white">
			<h1>Grocery Tracker</h1>
			<GroceryRow bind:groceryItems bind:total={groceryTotal} />
		</div>
	</Card>
</section>

<section id="expenses" class="m-10 mb-25 flex">
	<Card shadow="xl" size="xl">
		<div class="flex flex-col gap-4 p-4">
			<h1 class="dark:text-white">Expected Expenses</h1>
			<ExpenseTable bind:items />
			<!-- Hidden field to hold serialized data -->
			<input type="hidden" name="expenses" bind:this={hiddenInput} />
		</div>
	</Card>
</section>

<style>
	h1 {
		display: flex;
	}
</style>
