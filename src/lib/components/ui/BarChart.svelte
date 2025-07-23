<script lang="ts">
	import type { ApexOptions } from 'apexcharts';

	let { income = $bindable(), items = $bindable() } = $props();

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

<div class="card max-w-screen shadow-xl bg-neutral text-neutral-content">
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
</div>
