<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import NavBar from '$lib/components/NavBar.svelte';
	import GroceryRow from '$lib/components/GroceryRow.svelte';
	import { Input, Card } from 'svelte-5-ui-lib';
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

<section id="top" class="flex gap-6">
	<div>
		<h1 class="flex px-10 md:mt-15">Hello, {data.user.username}!</h1>
		<h2 class="flex px-10 text-xl md:mb-20">Let's budget.</h2>
	</div>
	<IncomeCard bind:income />
</section>

<section id="groceries-graph" class="m-10 grid grid-cols-1 justify-center gap-6 md:grid-cols-3">
	<Card shadow="xl" size="lg">
		<form class="flex flex-col gap-4 dark:text-white">
			<h1 class="col-span-3">Grocery Tracker</h1>
			<GroceryRow bind:groceryItems bind:total={groceryTotal} />
		</form>
	</Card>
</section>

<section id="expenses" class="m-10 mb-25 flex gap-6">
	<Card shadow="xl" size="xl">
		<form method="POST" action="?/add_expense" class="flex flex-col gap-4 p-4">
			<h1 class="col-span-2 dark:text-white">Expected Expenses</h1>
			<ExpenseTable bind:items />
			<!-- Hidden field to hold serialized data -->
			<input type="hidden" name="expenses" bind:this={hiddenInput} />
		</form>
	</Card>
</section>

<style>
	h1,
	h2,
	form {
		display: flex;
		/* padding: 0 0 0 2rem; */
	}
</style>
