<script lang="ts">
	import type { PageServerData } from './$types';
	import NavBar from '$lib/components/ui/NavBar.svelte';
	import GroceryRow from '$lib/components/GroceryRow.svelte';
	import { Card } from 'svelte-5-ui-lib';
	import ExpenseTable from '$lib/components/ExpenseTable.svelte';
	import IncomeCard from '$lib/components/IncomeCard.svelte';
	import BarChart from '$lib/components/BarChart.svelte';

	interface Props {
		data: PageServerData;
		form: any;
	}

	let { data }: Props = $props();

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

	let groceryItems = $state(
		(data.groceryItems ?? []).map((item) => {
			const [__, year, Month, _, weekNumber] = (item.id as string).split('-');
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

<NavBar name={data.user.displayName} />
<main class="flex flex-col gap-10">
	<section id="top" class="mx-5 mt-10 gap-6 md:mx-10 md:mt-20 md:w-auto">
		<IncomeCard name={data.user.displayName} bind:income />
	</section>

	<!-- <section id="groceries-graph" class="grid grid-cols-1 md:m-10 md:grid-cols-2"> -->
	<section id="groceries-graph" class="flex flex-col gap-10 md:m-10 md:flex-row">
		<div class="mx-5 flex flex-col gap-4 md:mx-0 md:w-1/2">
			<Card shadow="xl" size="lg">
				<div class="dark:text-white">
					<h1>Grocery Tracker</h1>
					<GroceryRow bind:groceryItems bind:total={groceryTotal} />
				</div>
			</Card>
		</div>
		<div class="mx-5 flex flex-col gap-2 md:mx-0 md:w-1/2">
			<BarChart {income} {items} />
		</div>
	</section>

	<section id="expenses" class="mx-5 mb-25 md:mx-10">
		<Card shadow="xl" size="xl">
			<div class="flex flex-col gap-4 md:p-4">
				<h1 class="dark:text-white">Expected Expenses</h1>
				<ExpenseTable bind:items />
			</div>
		</Card>
	</section>
</main>

<style>
	h1 {
		display: flex;
	}
</style>
