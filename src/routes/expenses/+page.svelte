<!-- +page.svelte -->
<script lang="ts">
	import ExpenseTable from "$lib/components/ExpenseTable.svelte";
	import GroceryRow from "$lib/components/tables/GroceryRow.svelte";
	import type { PageServerData } from "./$types";
	import NavBar from "$lib/components/ui/NavBar.svelte";
	import InvestmentsTable from "$lib/components/tables/InvestmentsTable.svelte";
	import AptTable from "$lib/components/tables/AptTable.svelte";
	import CarTable from "$lib/components/tables/CarTable.svelte";
	import LoanTable from "$lib/components/tables/LoanTable.svelte";
	import FunTable from "$lib/components/tables/FunTable.svelte";

	interface Props {
		data: PageServerData;
		form: any;
	}

	let { data }: Props = $props();

	function mapBudgetItems(items: any[] = []) {
		return items.map((item) => ({
			description: item.description,
			estimatedAmount: item.amount ?? 0,
			actualAmount: item.actualAmount ?? 0
		}));
	}

	let items = $state(mapBudgetItems(data?.expenses));
	let investments = $state(mapBudgetItems(data?.investments));
	let loans = $state(mapBudgetItems(data?.loans));
	let housing = $state(mapBudgetItems(data?.housing));
	let car = $state(mapBudgetItems(data?.car));
	let funItems = $state(mapBudgetItems(data?.fun));

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
	let actCarTotal = $state(0);
	let estCarTotal = $state(0);
	let actFunTotal = $state(0);
	let estFunTotal = $state(0);
	let actHousingTotal = $state(0);
	let estHousingTotal = $state(0);
	let actInvestTotal = $state(0);
	let estInvestTotal = $state(0);
	let actLoanTotal = $state(0);
	let estLoanTotal = $state(0);

	$effect(() => {
		const groceriesRow = items.find((item: { description: string; }) => item.description === 'Groceries');
		if (groceriesRow) {
			groceriesRow.actualAmount = groceryTotal;
		}
		const carRow = items.find((item: { description: string; }) => item.description === 'Car');
		if (carRow) {
			carRow.actualAmount = actCarTotal;
			carRow.estimatedAmount = estCarTotal;
		}
		const funRow = items.find((item: { description: string; }) => item.description === 'Fun');
		if (funRow) {
			funRow.actualAmount = actFunTotal;
			funRow.estimatedAmount = estFunTotal;
		}
		const housingRow = items.find((item: { description: string; }) => item.description === 'Housing');
		if (housingRow) {
			housingRow.actualAmount = actHousingTotal;
			housingRow.estimatedAmount = estHousingTotal;
		}
		const investmentsRow = items.find((item: { description: string; }) => item.description === 'Investments');
		if (investmentsRow) {
			investmentsRow.actualAmount = actInvestTotal;
			investmentsRow.estimatedAmount = estInvestTotal;
		}
		const loansRow = items.find((item: { description: string; }) => item.description === 'Loans');
		if (loansRow) {
			loansRow.actualAmount = actLoanTotal;
			loansRow.estimatedAmount = estLoanTotal;
		}
	});
</script>

<div>
	<NavBar name={data?.user?.displayName ?? 'User'} />
	<!-- Mobile View -->
	<section id="mobile-column" class="grid grid-cols-1 md:hidden mt-5">
		<div class="collapse collapse-arrow shadow-xl bg-neutral text-neutral-content m-3">
			<input type="checkbox" />
			<h1 class="collapse-title text-2xl font-bold p-2 px-4">Loans</h1>
			<div class="collapse-content p-2">
				<LoanTable bind:loans bind:actLoanTotal bind:estLoanTotal />
			</div>
		</div>
		<div class="collapse collapse-arrowshadow-xl bg-neutral text-neutral-content m-3">
			<input type="checkbox" />
			<h1 class="collapse-title text-2xl font-bold p-2 px-4">Investments</h1>
			<div class="collapse-content p-2">
				<InvestmentsTable bind:investments bind:actInvestTotal bind:estInvestTotal />
			</div>
		</div>
		<div class="collapse collapse-arrow shadow-xl bg-neutral text-neutral-content m-3">
			<input type="checkbox" />
			<h1 class="collapse-title text-2xl font-bold p-2 px-4">Housing</h1>
			<div class="collapse-content p-2">
				<AptTable bind:housing bind:actHousingTotal bind:estHousingTotal />
			</div>
		</div>
		<div class="collapse collapse-arrow shadow-xl bg-neutral text-neutral-content m-3">
			<input type="checkbox" />
			<h1 class="collapse-title text-2xl font-bold p-2 px-4">Car Expenses</h1>
			<div class="collapse-content p-2">
				<CarTable bind:car bind:actCarTotal bind:estCarTotal />
			</div>
		</div>
		<div class="collapse collapse-arrow shadow-xl bg-neutral text-neutral-content m-3">
			<input type="checkbox" />
			<h1 class="collapse-title text-2xl font-bold p-2 px-4">Grocery Tracker</h1>
			<div class="collapse-content p-2">
				<GroceryRow bind:groceryItems bind:total={groceryTotal} />
			</div>
		</div>
		<div class="collapse collapse-arrow shadow-xl bg-neutral text-neutral-content m-3">
			<input type="checkbox" />
			<h1 class="collapse-title text-2xl font-bold p-2 px-4">Fun Money</h1>
			<div class="collapse-content p-2">
				<FunTable bind:funItems bind:actFunTotal bind:estFunTotal />
			</div>
		</div>
	</section>

	<!-- Desktop View -->
	<section id="desktop-view" class="hidden md:grid md:grid-cols-2">
		<div class="card card-md shadow-xl bg-neutral text-neutral-content m-10">
			<div class="card-body">
				<h1 class="card-title text-2xl font-bold p-4">Loans</h1>
				<LoanTable bind:loans bind:actLoanTotal bind:estLoanTotal />
			</div>
		</div>
		<div class="card card-md shadow-xl bg-neutral text-neutral-content m-10">
			<div class="card-body">
				<h1 class="card-title text-2xl font-bold p-4">Investments</h1>
				<InvestmentsTable bind:investments bind:actInvestTotal bind:estInvestTotal />
			</div>
		</div>
		<div class="card card-md shadow-xl bg-neutral text-neutral-content m-10">
			<div class="card-body">
				<h1 class="card-title text-2xl font-bold p-4">Housings</h1>
				<AptTable bind:housing bind:actHousingTotal bind:estHousingTotal />
			</div>
		</div>
		<div class="card card-md shadow-xl bg-neutral text-neutral-content m-10">
			<div class="card-body">
				<h1 class="card-title text-2xl font-bold p-4">Car Expenses</h1>
				<CarTable bind:car bind:actCarTotal bind:estCarTotal />
			</div>
		</div>
		<div class="card card-md shadow-xl bg-neutral text-neutral-content m-10">
			<div class="card-body">
				<h1 class="card-title text-2xl font-bold p-4">Grocery Tracker</h1>
				<GroceryRow bind:groceryItems bind:total={groceryTotal} />
			</div>
		</div>
		<div class="card card-md shadow-xl bg-neutral text-neutral-content m-10">
			<div class="card-body">
				<h1 class="card-title text-2xl font-bold p-4">Fun Money</h1>
				<FunTable bind:funItems bind:actFunTotal bind:estFunTotal />
			</div>
		</div>
	</section>

    <section id="expenses" class="mb-25">
        <div class="card card-md shadow-xl bg-neutral text-neutral-content m-5 md:m-10">
            <div class="card-body">
                <h1 class="card-title text-2xl font-bold p-4">Total Expenses</h1>
                <ExpenseTable bind:items />
            </div>
        </div>
    </section>
</div>
