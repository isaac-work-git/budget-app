<script lang="ts">
	import { Card, Input } from 'svelte-5-ui-lib';

	let { income = $bindable() } = $props();

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

<Card shadow="xl">
	<div class="flex flex-col gap-4 md:flex-row">
		<div>
			<h1 class="no-wrap pb-2 dark:text-white">Monthly Income:</h1>
			<h2 class="text-xl dark:text-white">
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
