<script lang="ts">
	import { Card, Input } from 'svelte-5-ui-lib';

	let { income = $bindable(), name } = $props();

	async function saveIncome(e: FocusEvent) {
		const input = e.target as HTMLInputElement;
		const rawValue = input.value.replace(/[^0-9.]/g, '');
		const parsed = parseFloat(rawValue);

		if (isNaN(parsed)) return;

		const formData = new FormData();
		formData.append('income', parsed.toString());

		const res = await fetch('?/income', {
			method: 'POST',
			body: formData
		});

		if (res.ok) {
			income = parsed;
		} else {
			console.error('Failed to save income');
		}
	}
</script>

<Card shadow="xl" size="xl">
	<div class="flex flex-col gap-4 md:flex-row">
		<div class="flex w-full flex-col dark:text-white">
			<h1 class="md:px-10">Hello, {name}!</h1>
			<h2 class="text-xl md:px-10">Let's <span class="h2-budgt">budgt.</span></h2>
		</div>
		<div class="flex w-full flex-col dark:text-white">
			<h1 class="pb-2">Monthly Income:</h1>
			<h2 class="text-xl">
				{#if income}
					{new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: 'USD'
					}).format(income)}
				{/if}
			</h2>
		</div>

		<Input
			name="income"
			type="text"
			placeholder="Enter amount"
			oninput={(e) => {
				const input = e.target as HTMLInputElement;
				input.value = input.value.replace(/[^0-9.]/g, '');
			}}
			onblur={saveIncome}
		/>
	</div>
</Card>

<style>
	.h2-budgt {
		color: var(--color-primary-500);
	}
</style>
