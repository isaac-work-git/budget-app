<script lang="ts">
	let { item, i, onDelete } = $props();
</script>

<div class="grid grid-cols-3 items-center gap-2">
	<input
		type="text"
		bind:value={item.description}
		placeholder="Description"
		class="rounded-lg bg-blue-300 p-2"
	/>

	<input
		type="text"
		bind:value={item.amount}
		placeholder="Amount"
		class="rounded-lg bg-blue-300 p-2"
		oninput={(e) => {
			const input = e.target as HTMLInputElement;
			input.value = input.value.replace(/[^0-9.]/g, '');
		}}
	/>

	<button
		type="button"
		onclick={() => onDelete(i)}
		class="w-min rounded-lg bg-red-600 px-5 text-white hover:bg-red-700"
	>
		X
	</button>
</div>
