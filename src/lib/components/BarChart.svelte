<script lang="ts">
	import { Chart, Card } from 'svelte-5-ui-lib';
	import { ArrowUpOutline, ChevronDownOutline } from 'flowbite-svelte-icons';
	import type { ApexOptions } from 'apexcharts';

	let { income = $bindable(), items = $bindable() } = $props();

	let profit = $derived.by(
		() =>
			income -
			items.reduce(
				(
					/** @type {any} */ sum: any,
					/** @type {{ actualAmount: any; }} */ item: { actualAmount: any }
				) => sum + (item.actualAmount ?? 0),
				0
			)
	);

	let profitRate = $derived.by(() => (income === 0 ? 0 : (profit / income) * 100));

	let optionBar = $state<ApexOptions>({
		series: [
			{ name: 'Income', color: '#31C48D', data: [] },
			{ name: 'Expense', color: '#F05252', data: [] }
		],
		chart: {
			type: 'bar',
			width: '100%',
			height: 400,
			toolbar: { show: false },
			sparkline: { enabled: false }
		},
		plotOptions: {
			bar: {
				horizontal: true,
				columnWidth: '100%',
				borderRadius: 6,
				borderRadiusApplication: 'end'
			}
		},
		dataLabels: { enabled: false },
		tooltip: {
			shared: true,
			intersect: false,
			y: {
				formatter: (value: number) => `$${value.toFixed(0)}`
			}
		},
		xaxis: {
			categories: ['This Month'],
			labels: {
				formatter: (val: string) => `$${val}`,
				style: {
					fontFamily: 'Inter, sans-serif',
					cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
				}
			},
			axisTicks: { show: false },
			axisBorder: { show: false }
		},
		yaxis: {
			labels: {
				style: {
					fontFamily: 'Inter, sans-serif',
					cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
				}
			}
		},
		grid: {
			show: true,
			strokeDashArray: 4,
			padding: { left: 2, right: 2, top: -20 }
		}
	});

	$effect(() => {
		const totalExpenses = items.reduce(
			(
				/** @type {any} */ sum: any,
				/** @type {{ actualAmount: any; }} */ item: { actualAmount: any }
			) => sum + (item.actualAmount ?? 0),
			0
		);
		optionBar.series = [
			{ name: 'Income', color: '#31C48D', data: [income] },
			{ name: 'Expense', color: '#F05252', data: [totalExpenses] }
		];
	});
</script>

<Card size="xl" class="mx-10" shadow="xl">
	<div class="flex justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
		<dl>
			<dt class="pb-1 text-base font-normal text-gray-500 dark:text-gray-400">Profit</dt>
			<dd
				class="text-3xl leading-none font-bold"
				class:text-green-600={profit >= 0}
				class:text-red-600={profit < 0}
			>
				{new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD'
				}).format(profit)}
			</dd>
		</dl>

		<span
			class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium"
			class:bg-green-100={profit >= 0}
			class:text-green-800={profit >= 0}
			class:bg-red-100={profit < 0}
			class:text-red-800={profit < 0}
		>
			{#if profit >= 0}
				<ArrowUpOutline class="me-1.5 h-2.5 w-2.5" />
			{:else}
				<ChevronDownOutline class="me-1.5 h-2.5 w-2.5" />
			{/if}
			Profit rate {profitRate.toFixed(1)}%
		</span>
	</div>

	<div class="grid grid-cols-2 py-3">
		<dl>
			<dt class="pb-1 text-base font-normal text-gray-500 dark:text-gray-400">Income</dt>
			<dd class="text-xl leading-none font-bold text-green-500 dark:text-green-400">
				${income}
			</dd>
		</dl>
		<dl>
			<dt class="pb-1 text-base font-normal text-gray-500 dark:text-gray-400">Expense</dt>
			<dd class="text-xl leading-none font-bold text-red-600 dark:text-red-500">
				-${items.reduce(
					(sum: any, item: { actualAmount: any }) => sum + (item.actualAmount ?? 0),
					0
				)}
			</dd>
		</dl>
	</div>

	<Chart options={optionBar} />
</Card>
