<script lang="ts">
	interface Props {
		groceryItems: any[];
		total: number;
	}
	let { groceryItems = $bindable(), total = $bindable() }: Props = $props();

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

<table class="table w-full table-xs md:table-md">
	<thead>
		<tr>
			{#each headItems as item}
				<th class="py-3 text-lg text-secondary font-semibold">{item}</th>
			{/each}
		</tr>
	</thead>
	<tbody class="divide-y">
		{#each groceryItems as groceryItem, i}
			<tr>
				<td>{groceryItem.week}</td>
				<td>
					<input
						name="amount"
						type="text"
						step="0.01"
						min="0"
						placeholder="0.00"
						class="input input-bordered w-full max-w-xs text-secondary"
						bind:value={groceryItems[i].amount}
						oninput={(e) => {
							const input = e.target as HTMLInputElement;
							input.value = input.value.replace(/[^0-9.]/g, '');
							groceryItems[i].amount = input.value ? parseFloat(input.value) : 0;
						}}
						onblur={() => saveGrocery(groceryItem)}
					/>
				</td>
				<td>{groceryItem.month}</td>
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
				}).format(
					groceryItems.reduce((sum: any, item: { amount: any }) => sum + (item.amount ?? 0), 0)
				)}
			</td>
			<td></td>
		</tr>
	</tfoot>
</table>
