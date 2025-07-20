<!-- ExpenseTable.svelte -->
<script lang="ts">
	let { items = $bindable() } = $props();

	const headItems = ['Description', 'Estimated Amount', 'Actual Amount'];

	// Calculate totals using $derived for Svelte 5 runes mode
	const estimatedTotal = $derived(
		items.reduce((sum: number, item: any) => sum + (Number(item.estimatedAmount) || 0), 0)
	);
	const actualTotal = $derived(
		items.reduce((sum: number, item: any) => sum + (Number(item.actualAmount) || 0), 0)
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
							class="input input-bordered w-full max-w-xs text-secondary"
							bind:value={items[i].estimatedAmount}
							readonly
							placeholder="0.00"
						/>
					</td>
					<td>
						<input
							type="number"
							step="0.01"
							min="0"
							class="input input-bordered w-full max-w-xs text-secondary"
							bind:value={items[i].actualAmount}
							readonly
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