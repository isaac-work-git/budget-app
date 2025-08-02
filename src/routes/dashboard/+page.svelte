<script lang="ts">
	import type { PageServerData } from './$types';
	import NavBar from '$lib/components/ui/NavBar.svelte';
	import IncomeCard from '$lib/components/IncomeCard.svelte';
	import SankeyChart from '$lib/components/ui/SankeyChart.svelte';
	import type { ExpenseItem } from '$lib/types/expenseItem';
	import { onMount } from 'svelte';
	import type { BudgetItem } from '$lib/types/budgetItem';

	interface Props {
		data: PageServerData;
		form: any;
	}
	
	let { data }: Props = $props();
	
	let items: ExpenseItem[] = $state(
		(data.expenses ?? []).map((item) => ({
			description: String(item.description),
			estimatedAmount: Number(item.amount ?? 0),
			actualAmount: Number(item.actualAmount ?? 0)
		}))
	);

	let income: BudgetItem[] = $state(
		(Array.isArray(data.budget) ? data.budget : []).map((item) => ({
			income: Number(item.income ?? 0),
			expense: Number(item.expense ?? 0),
			month: item.month,
			year: item.year
		}))
	);

	let BarChart: typeof import('$lib/components/ui/BarChart.svelte').default | null = $state(null);

	onMount(async () => {
		const module = await import('$lib/components/ui/BarChart.svelte');
		BarChart = module.default;
	});
</script>

<NavBar name={data.user.displayName} />
<main class="flex flex-col gap-10">
	<section id="top" class="mx-5 my-10 gap-6 md:mx-10 md:mt-20 md:w-auto">
		<IncomeCard name={data.user.displayName} income={income} />
		<SankeyChart {items} income={income.reduce((sum, item) => sum + item.income, 0)} />
		{#if BarChart}
			<BarChart {income} {items} />
		{/if}
	</section>
</main>