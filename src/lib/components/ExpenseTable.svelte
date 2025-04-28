<script lang="ts">
	import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, Input } from 'svelte-5-ui-lib';

	let { items = $bindable() } = $props(); // <-- items passed from parent page!

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
</script>

<Table striped noborder>
	<TableHead {headItems} />
	<TableBody class="divide-y">
		{#each items as expense, i}
			<TableBodyRow
				class={`${expense.actualAmount > expense.estimatedAmount ? 'bg-red-100 transition-colors duration-300 dark:bg-red-700' : 'transition-colors duration-300'}`}
			>
				<TableBodyCell>{expense.description}</TableBodyCell>
				<TableBodyCell>
					<Input
						type="text"
						class="rounded dark:text-black"
						bind:value={items[i].estimatedAmount}
						oninput={(e) => {
							const input = e.target as HTMLInputElement;
							input.value = input.value.replace(/[^0-9.]/g, '');
							items[i].estimatedAmount = input.value ? parseFloat(input.value) : 0;
						}}
						onblur={() => saveExpense(expense)}
					/>
				</TableBodyCell>

				<TableBodyCell>
					<Input
						type="text"
						class="rounded dark:text-black"
						bind:value={items[i].actualAmount}
						oninput={(e) => {
							const input = e.target as HTMLInputElement;
							input.value = input.value.replace(/[^0-9.]/g, '');
							items[i].actualAmount = input.value ? parseFloat(input.value) : 0;
						}}
						onblur={() => saveExpense(expense)}
					/>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
	{#snippet footerSlot()}
		<tfoot>
			<tr class="font-semibold text-gray-900 dark:text-white">
				<th scope="row" class="px-6 py-3 text-base">Total</th>

				<td class="px-6 py-3">
					{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
						items.reduce(
							(sum: any, item: { estimatedAmount: any }) => sum + (item.estimatedAmount ?? 0),
							0
						)
					)}
				</td>

				<td class="px-6 py-3">
					{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
						items.reduce(
							(sum: any, item: { actualAmount: any }) => sum + (item.actualAmount ?? 0),
							0
						)
					)}
				</td>
			</tr>
		</tfoot>
	{/snippet}
</Table>
