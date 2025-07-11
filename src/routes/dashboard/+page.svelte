<script lang="ts">
	import type { PageServerData } from './$types';
	import NavBar from '$lib/components/ui/NavBar.svelte';
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

	
</script>

<NavBar name={data.user.displayName} />
<main class="flex flex-col gap-10">
	<section id="top" class="mx-5 mt-10 gap-6 md:mx-10 md:mt-20 md:w-auto">
		<IncomeCard name={data.user.displayName} bind:income />
		<BarChart {income} {items} />
	</section>
</main>