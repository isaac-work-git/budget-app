<!-- ExpenseTable.svelte -->
<script lang="ts">
	let { items = $bindable() } = $props();

	const headItems = ['Description', 'Estimated Amount', 'Actual Amount'];

	async function saveExpense(expense: any) {
		try {
			const formData = new FormData();
			formData.append('expense', JSON.stringify(expense));

			const response = await fetch('?/update_expense', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				console.error('Failed to save expense item');
			}
		} catch (error) {
			console.error('Error saving expense item', error);
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
		items[index][field] = cleanValue ? parseFloat(cleanValue) : 0;
	}

	// Calculate totals using $derived for Svelte 5 runes mode
	const estimatedTotal = $derived(
		items.reduce((sum: number, item: any) => sum + (Number(item.estimatedAmount) || 0), 0)
	);
	const actualTotal = $derived(
		items.reduce((sum: number, item: any) => sum + (Number(item.actualAmount) || 0), 0)
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
			{#each items as expense, i}
				<tr
					class={`${expense.actualAmount > expense.estimatedAmount ? 'bg-red-100 transition-colors duration-300 dark:bg-red-700' : 'transition-colors duration-300'}`}
				>
					<td class="font-medium">{expense.description}</td>
					<td>
						<input
							type="number"
							step="0.01"
							min="0"
							class="input input-bordered w-full max-w-xs"
							bind:value={items[i].estimatedAmount}
							oninput={(e) => handleNumberInput(e, i, 'estimatedAmount')}
							onblur={() => saveExpense(expense)}
							placeholder="0.00"
						/>
					</td>
					<td>
						<input
							type="number"
							step="0.01"
							min="0"
							class="input input-bordered w-full max-w-xs"
							class:input-disabled={expense.description === 'Groceries'}
							bind:value={items[i].actualAmount}
							readonly={expense.description === 'Groceries'}
							oninput={(e) => handleNumberInput(e, i, 'actualAmount')}
							onblur={() => saveExpense(expense)}
							placeholder="0.00"
						/>
					</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr class="font-semibold bg-base-200">
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