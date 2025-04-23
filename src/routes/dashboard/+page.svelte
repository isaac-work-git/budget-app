<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	interface Props {
		data: PageServerData;
		form: any;
	}

	let { data, form }: Props = $props();
</script>

<!-- <h1 class="flex md:mt-30 md:mb-20">Hi, {data.user.username}!</h1> -->
<p class="pb-10">Your user ID is {data.user.id}.</p>
<form method="post" action="?/logout" use:enhance>
	<button class="max-w-48 hover:bg-blue-500 hover:text-white active:bg-blue-600">Sign out</button>
</form>

<main>
	<section class="m-10 grid justify-center gap-10 md:grid-cols-3">
		<form method="POST" action="?/income" use:enhance class="flex flex-col">
			<span class="mb-6 rounded-xl bg-blue-500 p-4">
				<h1>Monthly Income</h1>
				{#if data.user.income}
					<p class="mb-2 rounded-lg bg-blue-300">
						{new Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: 'USD'
						}).format(parseFloat(data.user.income))}
					</p>
				{/if}
				<input
					name="income"
					type="text"
					placeholder="Enter amount"
					class="rounded-lg border-none bg-blue-300"
					oninput={(e) => {
						const input = e.target as HTMLInputElement;
						input.value = input.value.replace(/[^0-9.]/g, '');
					}}
					onblur={(e) => {
						const input = e.target as HTMLInputElement;
						const parsed = parseFloat(input.value.replace(/[^\d.]/g, ''));
						input.value = isNaN(parsed)
							? ''
							: new Intl.NumberFormat('en-US', {
									style: 'currency',
									currency: 'USD'
								}).format(parsed);
					}}
				/>
			</span>
			<button type="submit" class="max-w-48 hover:bg-blue-500 hover:text-white active:bg-blue-600"
				>Save</button
			>
		</form>

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
