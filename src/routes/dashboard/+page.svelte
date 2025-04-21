<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import { browser } from '$app/environment';

	let { currency, amount } = $props();
	let { data }: { data: PageServerData } = $props();

	$: locale = browser ? navigator.language : 'en-US';
	$: formatter = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: currency,
		maximumFractionDigits: 2,
		minimumFractionDigits: 2
	});
	$: formatted = formatter.format(amount);
</script>

<!-- <h1 class="flex md:mt-30 md:mb-20">Hi, {data.user.username}!</h1> -->
<p class="pb-10">Your user ID is {data.user.id}.</p>
<form method="post" action="?/logout" use:enhance>
	<button class="max-w-48 hover:bg-blue-500 hover:text-white active:bg-blue-600">Sign out</button>
</form>

<main>
	<section class="m-10 grid justify-center gap-10 md:grid-cols-3">
		<div>
			<div class="mb-6 rounded-xl bg-blue-500 p-4">
				<h1>Monthly Income</h1>
				<input
					name="income"
					id="currencyInput"
					type="text"
					placeholder="Enter amount"
					class="rounded-lg border-none bg-blue-300"
				/>
			</div>
			<button class="max-w-48 hover:bg-blue-500 hover:text-white active:bg-blue-600">Save</button>
		</div>

		<div class="rounded-xl bg-blue-500 p-4">
			<h1>Total Expenses</h1>
			<p id="currencyDisplay" class="rounded-lg bg-blue-300">0</p>
		</div>
		<div class="rounded-xl bg-blue-500 p-4">
			<h1>Balance Leftover</h1>
			<p id="currencyDisplay" class="rounded-lg bg-blue-300">0</p>
		</div>
	</section>
</main>

<style>
	h1,
	p,
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
