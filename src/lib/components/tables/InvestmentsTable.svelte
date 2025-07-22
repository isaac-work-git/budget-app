<script lang="ts">
	interface Props {
		investments: any[];
		actInvestTotal: number;
		estInvestTotal: number;
	}
	let { investments = $bindable(), actInvestTotal = $bindable(), estInvestTotal = $bindable() }: Props = $props();

	const headItems = ['Description', 'Est. Amount', 'Actual'];

	async function saveInvestment(investment: any) {
		try {
			const formData = new FormData();
			formData.append('investment', JSON.stringify(investment));

			const response = await fetch(`${window.location.pathname}?/update_investment`, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				console.error('Failed to save investment item');
			}
		} catch (error) {
			console.error('Error saving investment item', error);
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
		investments[index][field] = cleanValue ? parseFloat(cleanValue) : 0;
	}

	$effect(() => {
		actInvestTotal = investments.reduce((sum, item) => sum + (item.actualAmount ?? 0), 0);
		estInvestTotal = investments.reduce((sum, item) => sum + (item.estimatedAmount ?? 0), 0);
	});
</script>

<div class="overflow-x-auto">
	<table class="table table-xs md:table-md">
		<thead>
			<tr>
				{#each headItems as item}
					<th class="py-3 text-lg text-secondary font-semibold">{item}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each investments as expense, i}
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
							bind:value={investments[i].estimatedAmount}
							oninput={(e) => handleNumberInput(e, i, 'estimatedAmount')}
							onblur={() => saveInvestment(expense)}
							placeholder="0.00"
						/>
					</td>
					<td>
						<input
							type="number"
							step="0.01"
							min="0"
							class="input input-bordered w-full max-w-xs text-secondary"
							bind:value={investments[i].actualAmount}
							oninput={(e) => handleNumberInput(e, i, 'actualAmount')}
							onblur={() => saveInvestment(expense)}
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
					}).format(estInvestTotal)}
				</td>
				<td class="px-6 py-3">
					{new Intl.NumberFormat('en-US', { 
						style: 'currency', 
						currency: 'USD' 
					}).format(actInvestTotal)}
				</td>
			</tr>
		</tfoot>
	</table>
</div>