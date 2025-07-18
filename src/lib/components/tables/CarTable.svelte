<!-- ExpenseTable.svelte -->
<script lang="ts">
	let { car = $bindable() } = $props();

	const headItems = ['Description', 'Estimated Amount', 'Actual Amount'];

	async function saveInvestment(car: any) {
		try {
			const formData = new FormData();
			formData.append('investment', JSON.stringify(car));

			const response = await fetch('?update_car', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				console.error('Failed to save car item');
			}
		} catch (error) {
			console.error('Error saving car item', error);
		}
	}

	// Handle input changes more robustly
	function handleNumberInput(e: Event, index: number, field: 'estimatedAmount' | 'actualAmount') {
		const input = e.target as HTMLInputElement;
		// Allow numbers and decimal points
		const sanitized = input.value.replace(/[^0-9.]/g, '');
		
		// Prevent multiple decimal points
		const parts = sanitized.split('.');
		const cleanValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : sanitized;
		
		input.value = cleanValue;
		car[index][field] = cleanValue ? parseFloat(cleanValue) : 0;
	}

	// Calculate totals using $derived for Svelte 5 runes mode
	const estimatedTotal = $derived(
		car.reduce((sum: number, item: any) => sum + (Number(item.estimatedAmount) || 0), 0)
	);
	const actualTotal = $derived(
		car.reduce((sum: number, item: any) => sum + (Number(item.actualAmount) || 0), 0)
	);
</script>

<div class="overflow-x-auto">
	<table class="table table-zebra">
		<thead>
			<tr>
				{#each headItems as item}
					<th class="px-6 py-3 text-base font-semibold">{item}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each car as autoExpense, i}
				<tr
					class={`${autoExpense.actualAmount > autoExpense.estimatedAmount ? 'bg-red-100 transition-colors duration-300 dark:bg-red-700' : 'transition-colors duration-300'}`}
				>
					<td class="font-medium">{autoExpense.description}</td>
					<td>
						<input
							type="number"
							step="0.01"
							min="0"
							class="input input-bordered w-full max-w-xs"
							bind:value={car[i].estimatedAmount}
							oninput={(e) => handleNumberInput(e, i, 'estimatedAmount')}
							onblur={() => saveInvestment(autoExpense)}
							placeholder="0.00"
						/>
					</td>
					<td>
						<input
							type="number"
							step="0.01"
							min="0"
							class="input input-bordered w-full max-w-xs"
							class:input-disabled={autoExpense.description === 'Groceries'}
							bind:value={car[i].actualAmount}
							readonly={autoExpense.description === 'Groceries'}
							oninput={(e) => handleNumberInput(e, i, 'actualAmount')}
							onblur={() => saveInvestment(autoExpense)}
							placeholder="0.00"
						/>
					</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr class="font-semibold">
				<th scope="row" class="px-6 py-3 text-base">Total</th>
				<td class="px-6 py-3">
					{new Intl.NumberFormat('en-US', { 
						style: 'currency', 
						currency: 'USD' 
					}).format(estimatedTotal)}
				</td>
				<td class="px-6 py-3">
					{new Intl.NumberFormat('en-US', { 
						style: 'currency', 
						currency: 'USD' 
					}).format(actualTotal)}
				</td>
			</tr>
		</tfoot>
	</table>
</div>