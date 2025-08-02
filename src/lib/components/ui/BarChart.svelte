<!-- src/lib/components/ui/BarChart.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import type { ApexOptions } from 'apexcharts';

	let { income = $bindable(), items = $bindable() } = $props();
	let chartEl: HTMLElement;
	let chart: any;

	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	let optionBar: ApexOptions = {
		series: [],
		chart: { type: 'bar', height: 400, toolbar: { show: false } },
		plotOptions: { bar: { horizontal: false, columnWidth: '45%', borderRadius: 6 } },
		dataLabels: { enabled: false },
		tooltip: {
			shared: true,
			intersect: false,
			y: {
				formatter: (value: number) => `$${value.toFixed(0)}`
			}
		},
		xaxis: {
			categories: months,
			labels: {
				style: {
					fontFamily: 'Inter, sans-serif',
					cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
				}
			}
		},
		yaxis: {
			labels: {
				formatter: (val: number) => `$${val}`,
				style: {
					fontFamily: 'Inter, sans-serif',
					cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
				}
			}
		},
		grid: {
			strokeDashArray: 4,
			padding: { left: 2, right: 2 }
		}
	};

	onMount(async () => {
		const ApexCharts = (await import('apexcharts')).default;

		const monthlyIncome = Array(12).fill(income);
		const monthlyExpense = Array(12).fill(0);

		for (const item of items) {
			if (!item.date) continue;
			const month = new Date(item.date).getMonth();
			monthlyExpense[month] += item.actualAmount ?? 0;
		}

		optionBar.series = [
			{ name: 'Income', color: '#31C48D', data: monthlyIncome },
			{ name: 'Expense', color: '#F05252', data: monthlyExpense }
		];

		chart = new ApexCharts(chartEl, optionBar);
		await chart.render();
	});
</script>

<div bind:this={chartEl} class="w-full" ></div>
