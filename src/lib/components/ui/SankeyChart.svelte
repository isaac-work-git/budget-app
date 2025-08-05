<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import type { ExpenseItem } from '$lib/types/expenseItem';

    const { items = [], income } = $props<{ items?: ExpenseItem[]; income: number }>();
    let chartDiv: HTMLDivElement;
    let plotlyLoaded = $state(false);

    // Dynamically import Plotly to avoid SSR issues
    let Plotly: any;

    onMount(async () => {
        try {
            // Import Plotly dynamically to avoid SSR issues
            const plotlyModule = await import('plotly.js-dist-min');
            Plotly = plotlyModule.default;
            plotlyLoaded = true;
            
            // Create chart after Plotly is loaded
            if (chartDiv) {
                createChart();
            }
        } catch (error) {
            console.error('Failed to load Plotly:', error);
        }
    });

    function createSankeyDataFromExpenses(items: ExpenseItem[], income: number) {
        // Start with Income as the source
        const labels = ["Income"];
        const links = [];

        // Filter and process valid expenses
        const validExpenses = items.filter(item => {
            const amount = Number(item.actualAmount) || 0;
            return item.description && amount > 0;
        });

        // Add unique expense categories
        const expenseCategories = new Set<string>();
        validExpenses.forEach((item) => {
            expenseCategories.add(item.description);
        });

        // Add categories to labels
        labels.push(...Array.from(expenseCategories));

        // Calculate total expenses with proper number conversion
        const totalExpenses = validExpenses.reduce((sum, item) => {
            const amount = Number(item.actualAmount) || 0;
            return sum + amount;
        }, 0);
        
        // Add remaining income as "Savings/Remaining" if there's any left
        const remainingIncome = Math.max(0, income - totalExpenses);
        if (remainingIncome > 0) {
            labels.push("Savings/Remaining");
        }

        // Create links from Income to each expense category
        validExpenses.forEach((item) => {
            const amount = Number(item.actualAmount) || 0;
            if (amount > 0) {
                links.push({
                    source: 0, // Income is always index 0
                    target: labels.indexOf(item.description),
                    value: amount
                });
            }
        });

        // Add link to remaining income if any
        if (remainingIncome > 0) {
            links.push({
                source: 0, // Income
                target: labels.indexOf("Savings/Remaining"),
                value: remainingIncome
            });
        }

        return {
            type: "sankey",
            orientation: "h",
            node: {
                pad: 20,
                thickness: 24,
                line: { width: 1.5 },
                label: labels,
                color: labels.map((label, index) => {
                    if (index === 0) return "#00b5fb"; // Income - Blue
                    if (label === "Savings/Remaining") return "#1fb854"; // Savings - Green
                    return "#f68067"; // Expenses - Orange
                }),
            hoverlabel: {
                bgcolor: "#111827", // dark background for tooltip
                bordercolor: "#D1D5DB",
                font: { color: "#F9FAFB" }
            }
            },
            link: {
                source: links.map((l) => l.source),
                target: links.map((l) => l.target),
                value: links.map((l) => l.value),
                color: links.map((_, i) => "rgba(107, 114, 128, 0.4)"),
            hoverinfo: "none"
            }
        };
    }

    function createChart() {
        if (!plotlyLoaded || !Plotly || !chartDiv) return;

        const plotData = [createSankeyDataFromExpenses(items, income)];

        Plotly.newPlot(chartDiv, plotData, {
            font: {
                size: 14,
                color: "#ffffff", // Tailwind gray-700
                family: "Inter, sans-serif"
            },
            margin: { t: 30, l: 30, r: 30, b: 40 },
            paper_bgcolor: "transparent",
            plot_bgcolor: "transparent"
        }, {
            responsive: true,
            displayModeBar: false
        });
    }

    // Recreate chart when data changes
    $effect(() => {
        if (plotlyLoaded && chartDiv) {
            createChart();
        }
    });

    onDestroy(() => {
        if (chartDiv && Plotly) {
            Plotly.purge(chartDiv);
        }
    });
</script>

<div class="card w-full h-full flex items-center justify-center bg-neutral rounded-2xl shadow-lg mb-10">
    <div class="card-title text-2xl p-4">Income → Expenses Flow</div>
    <div bind:this={chartDiv}  class="w-full h-full" ></div>
</div>

{#if !plotlyLoaded}
	<div class="w-full h-full flex items-center justify-center bg-neutral rounded-2xl shadow-lgs mb-10">
		<div class="loading loading-spinner loading-lg"></div>
		<span class="ml-2 text-gray-500">Loading chart...</span>
	</div>
{/if}
