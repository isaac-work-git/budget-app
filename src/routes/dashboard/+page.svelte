<script lang="ts">
	import type { PageServerData } from './$types';
	import NavBar from '$lib/components/ui/NavBar.svelte';
	import IncomeCard from '$lib/components/IncomeCard.svelte';
	import SankeyChart from '$lib/components/ui/SankeyChart.svelte';
	import type { ExpenseItem } from '$lib/types/expenseItem';

	interface Props {
		data: PageServerData;
		form: any;
	}
	
	let { data }: Props = $props();
	
	let income = $state(0);
	let items: ExpenseItem[] = $state(
		(data.expenses ?? []).map((item) => ({
			description: String(item.description),
			estimatedAmount: Number(item.amount ?? 0),
			actualAmount: Number(item.actualAmount ?? 0)
		}))
	);

	if (typeof data.user.income === 'number') {
		income = data.user.income;
	} else if (typeof data.user.income === 'string') {
		income = parseFloat(data.user.income);
	} else {
		income = 0;
	}
</script>

<NavBar name={data.user.displayName} />
<main class="flex flex-col gap-10">
	<section id="top" class="mx-5 mt-10 gap-6 md:mx-10 md:mt-20 md:w-auto">
		<IncomeCard name={data.user.displayName} bind:income />
		<SankeyChart {items} {income} />
	</section>
</main>