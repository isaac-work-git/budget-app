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
		chart: { type: 'bar', height: 350, toolbar: { show: false } },
		plotOptions: { bar: { horizontal: false, columnWidth: '60%', borderRadius: 6 } },
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
					cssClass: 'text-xs font-normal fill-white'
				}
			}
		},
		yaxis: {
			labels: {
				formatter: (val: number) => `$${val}`,
				style: {
					fontFamily: 'Inter, sans-serif',
					cssClass: 'text-xs font-normal fill-white'
				}
			}
		},
		grid: {
			strokeDashArray: 4,
			padding: { left: 6, right: 4 }
		},
		legend: {
			labels: {
				colors: '#ffffff'
			}
		},
		fill: {
			opacity: 1
		}
	};

	onMount(async () => {
		const ApexCharts = (await import('apexcharts')).default;

		const monthlyIncome = Array(12).fill(0);
		const monthlyExpense = Array(12).fill(0);

		for (const entry of income) {
			const monthIndex = entry.month - 1; // assuming 0-indexed
			console.log(`Processing entry for month index: ${monthIndex}`);
			if (monthIndex >= 0 && monthIndex < 12) {
				console.log(`Adding income: ${entry.income}, expense: ${entry.expense} for month index: ${monthIndex}`);
				monthlyIncome[monthIndex] = entry.income ?? 0;
				monthlyExpense[monthIndex] = entry.expense ?? 0;
			}
		}

		optionBar.series = [
			{ name: 'Income', color: '#1fb854', data: monthlyIncome },
			{ name: 'Expense', color: '#f68067', data: monthlyExpense }
		];

		chart = new ApexCharts(chartEl, optionBar);
		await chart.render();
	});
</script>

<div class="card w-full h-full flex items-center justify-center bg-neutral rounded-2xl shadow-lg">
	<div class="card-title text-2xl p-4">Monthly Income vs Expense</div>
	<div bind:this={chartEl} class="w-full" ></div>
</div>
