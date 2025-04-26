<script lang="ts">
	let { groceryItem = $bindable() } = $props();

	async function saveGrocery() {
		try {
			const formData = new FormData();
			formData.append(
				'groceryItem',
				JSON.stringify({
					id: groceryItem.id,
					amount: groceryItem.amount
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
</script>

<div class="grid grid-cols-3 items-center gap-2">
	<p>{groceryItem.week}</p>
	<!-- Editable Amount -->
	<input
		type="text"
		class="rounded bg-blue-300 text-center"
		bind:value={groceryItem.amount}
		oninput={(e) => {
			const input = e.target as HTMLInputElement;
			// Allow only numbers and decimal points
			input.value = input.value.replace(/[^0-9.]/g, '');
			groceryItem.amount = input.value ? parseFloat(input.value) : null;
		}}
		onblur={saveGrocery}
	/>
	<p>{groceryItem.month}</p>
</div>
