<script lang="ts">
	import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, Input } from 'svelte-5-ui-lib';

	let { groceryItems = $bindable() } = $props(); // array now!

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

	const headItems = ['Name', 'Amount', 'Balance', 'Month'];
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
				<TableBodyCell>
					{new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: 'USD'
					}).format(
						groceryItems.reduce((sum: any, item: { amount: any }) => sum + (item.amount ?? 0), 0)
					)}
				</TableBodyCell>
				<TableBodyCell>{groceryItem.month}</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
