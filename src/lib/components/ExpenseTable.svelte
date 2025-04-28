<script>
	import { Table } from 'svelte-5-ui-lib';
	const tableItems = [
		{ description: 'Rent/Mortgage', amount: '0' },
		{ description: 'Tithing', amount: '0' },
		{ description: 'Electricity Bill', amount: '0' },
		{ description: 'Groceries', amount: '0' },
		{ description: 'Dining Out', amount: '0' },
		{ description: 'Car Payment', amount: '0' },
		{ description: 'Insurance', amount: '0' },
		{ description: 'Gas', amount: '0' },
		{ description: '529 Plan', amount: '0' },
		{ description: 'Toiletries', amount: '0' },
		{ description: 'Ashtyn Fun', amount: '0' },
		{ description: 'Isaac Fun', amount: '0' },
		{ description: 'Wells Fun', amount: '0' },
		{ description: 'Savings Deposit', amount: '0' }
	];
</script>

<Table {tableItems} striped noborder shadow>
	{#snippet footerSlot()}
		<tfoot>
			<tr class="font-semibold text-gray-900 dark:text-white">
				<th scope="row" class="px-6 py-3 text-base">Total</th>
				<td class="px-6 py-3">$5,097</td>
			</tr>
		</tfoot>
	{/snippet}
</Table>
