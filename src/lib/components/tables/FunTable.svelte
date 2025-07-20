<!-- ExpenseTable.svelte -->
<script lang="ts">
	let { funItems = $bindable() } = $props();

	const headItems = ['Description', 'Estimated Amount', 'Actual Amount'];

	async function saveFun(fun: any) {
		try {
			const formData = new FormData();
			formData.append('fun', JSON.stringify(fun));

			const response = await fetch(`${window.location.pathname}?/update_fun`, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				console.error('Failed to save fun item');
			}
		} catch (error) {
			console.error('Error saving fun item', error);
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
		funItems[index][field] = cleanValue ? parseFloat(cleanValue) : 0;
	}

	// Calculate totals using $derived for Svelte 5 runes mode
	const estimatedTotal = $derived(
		funItems.reduce((sum: number, item: any) => sum + (Number(item.estimatedAmount) || 0), 0)
	);
	const actualTotal = $derived(
		funItems.reduce((sum: number, item: any) => sum + (Number(item.actualAmount) || 0), 0)
	);
</script>

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				{#each headItems as item}
					<th class="py-3 text-lg text-secondary font-semibold">{item}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each funItems as funExpense, i}
				<tr
					class={`${funExpense.actualAmount > funExpense.estimatedAmount ? 'bg-red-100 transition-colors duration-300 dark:bg-red-700' : 'transition-colors duration-300'}`}
				>
					<td class="font-medium">{funExpense.description}</td>
					<td>
						<input
							type="number"
							step="0.01"
							min="0"
							class="input input-bordered w-full max-w-xs text-secondary"
							bind:value={funItems[i].estimatedAmount}
							oninput={(e) => handleNumberInput(e, i, 'estimatedAmount')}
							onblur={() => saveFun(funExpense)}
							placeholder="0.00"
						/>
					</td>
					<td>
						<input
							type="number"
							step="0.01"
							min="0"
							class="input input-bordered w-full max-w-xs text-secondary"
							bind:value={funItems[i].actualAmount}
							oninput={(e) => handleNumberInput(e, i, 'actualAmount')}
							onblur={() => saveFun(funExpense)}
							placeholder="0.00"
						/>
					</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr class="font-semibold text-secondary text-lg">
				<th scope="row" class="py-3">Total</th>
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