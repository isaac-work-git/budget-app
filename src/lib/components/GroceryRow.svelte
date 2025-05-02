<script lang="ts">
	import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, Input } from 'svelte-5-ui-lib';

	interface Props {
		groceryItems: any[];
		total: number;
	}
	let { groceryItems = $bindable(), total = $bindable() }: Props = $props();
	console.log(groceryItems);

	$effect(() => {
		total = groceryItems.reduce((sum: any, item: { amount: any }) => sum + (item.amount ?? 0), 0);
	});

	async function saveGrocery(groceryItem: { id: any; amount: any }) {
		try {
			if (!groceryItem?.id || typeof groceryItem.id !== 'string') {
				console.error('Invalid or missing groceryItem.id:', groceryItem.id);
				return;
			}

			const amount = parseFloat(groceryItem.amount as any);

			if (isNaN(amount)) {
				console.error('Invalid amount:', groceryItem.amount);
				return;
			}

			const formData = new FormData();
			formData.append(
				'groceryItem',
				JSON.stringify({
					id: groceryItem.id,
					amount: amount
				})
			);

			const response = await fetch('?/update_grocery', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				console.error('Failed to save grocery item');
			}
		} catch (error) {
			console.error('Error saving grocery item', error);
		}
	}

	const headItems = ['Week', 'Amount', 'Month'];
</script>

<Table striped noborder>
	<TableHead {headItems} />
	<TableBody class="divide-y">
		{#each groceryItems as groceryItem, i}
			<TableBodyRow>
				<TableBodyCell>{groceryItem.week}</TableBodyCell>
				<TableBodyCell>
					<Input
						name="amount"
						type="text"
						class="rounded dark:text-black"
						bind:value={groceryItems[i].amount}
						oninput={(e) => {
							const input = e.target as HTMLInputElement;
							input.value = input.value.replace(/[^0-9.]/g, '');
							groceryItems[i].amount = input.value ? parseFloat(input.value) : 0;
						}}
						onblur={() => saveGrocery(groceryItem)}
					/>
				</TableBodyCell>
				<TableBodyCell>{groceryItem.month}</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
	{#snippet footerSlot()}
		<tfoot>
			<tr class="font-semibold text-gray-900 dark:text-white">
				<th scope="row" class="px-6 py-3 text-base">Total</th>
				<td class="px-6 py-3">
					{new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: 'USD'
					}).format(
						groceryItems.reduce((sum: any, item: { amount: any }) => sum + (item.amount ?? 0), 0)
					)}
				</td>
				<td></td>
			</tr>
		</tfoot>
	{/snippet}
</Table>
