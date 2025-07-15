<!-- +page.svelte -->
<script lang="ts">
	import ExpenseTable from "$lib/components/ExpenseTable.svelte";
	import GroceryRow from "$lib/components/tables/GroceryRow.svelte";
	import type { PageServerData } from "./$types";
	import NavBar from "$lib/components/ui/NavBar.svelte";

	interface Props {
		data: PageServerData;
		form: any;
	}

	let { data }: Props = $props();

	// Add null safety checks and proper typing
	let items = $state(
		(data?.expenses ?? []).map((item: any) => ({
			description: item.description,
			estimatedAmount: item.amount ?? 0, // original "amount" becomes "estimated"
			actualAmount: item.actualAmount ?? 0 // new actualAmount starts at 0
		}))
	);

	let groceryItems = $state(
		(data?.groceryItems ?? []).map((item: any) => {
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
		const groceriesRow = items.find((item: { description: string; }) => item.description === 'Groceries');
		if (groceriesRow) {
			groceriesRow.actualAmount = groceryTotal;
		}
	});
</script>

<div>
	<NavBar name={data?.user?.displayName ?? 'User'} />
	<section class="collapse collapse-arrow shadow-xl bg-neutral text-neutral-content md:w-1/2 m-10">
		<input type="checkbox" />
		<h1 class="collapse-title text-2xl font-bold p-4">Grocery Tracker</h1>
		<div class="collapse-content p-4">
			<GroceryRow bind:groceryItems bind:total={groceryTotal} />
		</div>
	</section>


    <section id="expenses" class="mx-5 mb-25 md:mx-10">
        
        <card shadow="xl" class="max-w-screen">
            <div class="flex flex-col gap-4 md:p-4">
                <h1 class="dark:text-white">Expected Expenses</h1>
                <ExpenseTable bind:items />
            </div>
        </card>
    </section>

	<section id="expenses" class="m-10 mb-25">
