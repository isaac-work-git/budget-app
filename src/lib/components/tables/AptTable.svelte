<!-- ExpenseTable.svelte -->
<script lang="ts">
	interface Props {
		housing: any[];
		actHousingTotal: number;
		estHousingTotal: number;
	}

	let { housing = $bindable(), actHousingTotal = $bindable(), estHousingTotal = $bindable() }: Props = $props();

	const headItems = ['Description', 'Est. Amount', 'Actual'];

	async function saveHousing(housing: any) {
		try {
			const formData = new FormData();
			formData.append('housing', JSON.stringify(housing));

			const response = await fetch(`${window.location.pathname}?/update_housing`, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				console.error('Failed to save housing item');
			}
		} catch (error) {
			console.error('Error saving housing item', error);
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
		housing[index][field] = cleanValue ? parseFloat(cleanValue) : 0;
	}

	$effect(() => {
		actHousingTotal = housing.reduce((sum, item) => sum + (item.actualAmount ?? 0), 0);
		estHousingTotal = housing.reduce((sum, item) => sum + (item.estimatedAmount ?? 0), 0);
	});
</script>

<div class="overflow-x-auto">
	<table class="table table-xs md:table-md">
		<thead>
			<tr>
				{#each headItems as item}
					<th class="md:py-3 md:text-lg text-secondary font-semibold">{item}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each housing as expense, i}
				<tr
					class={`${expense.actualAmount > expense.estimatedAmount ? 'bg-red-100 transition-colors duration-300 dark:bg-red-700' : 'transition-colors duration-300'}`}
				>
					<td class="font-medium">{expense.description}</td>
					<td>
						<input
							type="number"
							step="0.01"
							min="0"
							class="input input-bordered w-full max-w-xs text-secondary"
							bind:value={housing[i].estimatedAmount}
							oninput={(e) => handleNumberInput(e, i, 'estimatedAmount')}
							onblur={() => saveHousing(expense)}
							placeholder="0.00"
						/>
					</td>
					<td>
						<input
							type="number"
							step="0.01"
							min="0"
							class="input input-bordered w-full max-w-xs text-secondary"
							bind:value={housing[i].actualAmount}
							oninput={(e) => handleNumberInput(e, i, 'actualAmount')}
							onblur={() => saveHousing(expense)}
							placeholder="0.00"
						/>
					</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr class="font-semibold text-secondary md:text-lg">
				<th scope="row" class="md:py-3">Total</th>
				<td class="px-6 md:py-3">
					{new Intl.NumberFormat('en-US', { 
						style: 'currency', 
						currency: 'USD' 
					}).format(estHousingTotal)}
				</td>
				<td class="px-6 md:py-3">
					{new Intl.NumberFormat('en-US', { 
						style: 'currency', 
						currency: 'USD' 
					}).format(actHousingTotal)}
				</td>
			</tr>
		</tfoot>
	</table>
</div>