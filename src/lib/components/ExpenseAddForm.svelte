<script lang="ts">
	let { onAdd, draft } = $props();
	let newItem = $state({ description: '', amount: '' });

	function handleAdd() {
		if (!newItem.description || !newItem.amount) return;

		onAdd({
			description: newItem.description,
			amount: parseFloat(newItem.amount)
		});

		// Reset form
		newItem.description = '';
		newItem.amount = '';
	}
</script>

<div class="grid grid-cols-3 items-center gap-2">
	<input
		type="text"
		bind:value={draft.description}
		placeholder="Description"
		class="rounded-lg bg-blue-300 p-2"
	/>

	<input
		type="text"
		bind:value={draft.amount}
		placeholder="Amount"
		class="rounded-lg bg-blue-300 p-2"
		oninput={(e) => {
			const input = e.target as HTMLInputElement;
			input.value = input.value.replace(/[^0-9.]/g, '');
		}}
	/>

	<button
		type="button"
		onclick={() => {
			if (draft.description && draft.amount) {
				onAdd({
					description: draft.description,
					amount: parseFloat(draft.amount)
				});
				draft.description = '';
				draft.amount = '';
			}
		}}
		class="rounded-lg bg-green-600 px-2 text-white hover:bg-green-700"
	>
		Add
	</button>
</div>
