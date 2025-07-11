<script lang="ts">
	import ExpenseTable from "$lib/components/ExpenseTable.svelte";
	import GroceryRow from "$lib/components/GroceryRow.svelte";
	import { Card } from "svelte-5-ui-lib";
	import type { PageServerData } from "./$types";
	import NavBar from "$lib/components/ui/NavBar.svelte";

    interface Props {
		data: PageServerData;
		form: any;
	}

	let { data }: Props = $props();

	let items = $state(
		(data.expenses ?? []).map((item: { description: any; amount: any; actualAmount: any; }) => ({
			description: item.description,
			estimatedAmount: item.amount ?? 0, // original "amount" becomes "estimated"
			actualAmount: item.actualAmount ?? 0 // new actualAmount starts at 0
		}))
	);

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
		const groceriesRow = items.find((item: { description: string; }) => item.description === 'Groceries');
		if (groceriesRow) {
			groceriesRow.actualAmount = groceryTotal;
		}
	});
</script>

<div>
    <NavBar name={data.user.displayName} />
    <section id="groceries-graph" class="flex flex-col gap-10 md:m-10 md:flex-row">
		<div class="mx-5 flex flex-col gap-4 md:mx-0 md:w-1/2">
			<Card shadow="xl" size="xl">
				<div class="dark:text-white">
					<h1>Grocery Tracker</h1>
					<GroceryRow bind:groceryItems bind:total={groceryTotal} />
				</div>
			</Card>
		</div>
		
	</section>

    <section id="expenses" class="mx-5 mb-25 md:mx-10">
        
        <Card shadow="xl" class="max-w-screen">
            <div class="flex flex-col gap-4 md:p-4">
                <h1 class="dark:text-white">Expected Expenses</h1>
                <ExpenseTable bind:items />
            </div>
        </Card>
    </section>
</div>