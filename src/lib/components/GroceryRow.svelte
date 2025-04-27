<script lang="ts">
	let { groceryItem = $bindable() } = $props();

	// Save function when input is blurred
	async function saveGrocery() {
		try {
			// Step 1: Validate groceryItem id and amount
			if (!groceryItem?.id || typeof groceryItem.id !== 'string') {
				console.error('Invalid or missing groceryItem.id:', groceryItem.id);
				return;
			}

			const amount = parseFloat(groceryItem.amount as any);

			if (isNaN(amount)) {
				console.error('Invalid amount:', groceryItem.amount);
				return;
			}

			// Step 2: Build formData
			const formData = new FormData();
			formData.append(
				'groceryItem',
				JSON.stringify({
					id: groceryItem.id,
					amount: amount
				})
			);

			// Step 3: Send POST request to server
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
	<p class="text-center">{groceryItem.week}</p>
	<!-- Editable Amount -->
	<input
		type="text"
		class="rounded bg-blue-300 text-center"
		bind:value={groceryItem.amount}
		oninput={(e) => {
			const input = e.target as HTMLInputElement;
			input.value = input.value.replace(/[^0-9.]/g, '');
			groceryItem.amount = input.value ? parseFloat(input.value) : 0;
		}}
		onblur={saveGrocery}
	/>
	<p class="text-center">{groceryItem.month}</p>
</div>
