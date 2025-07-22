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
                pad: 15,
                thickness: 20,
                line: { color: "black", width: 0.5 },
                label: labels,
                color: labels.map((_, index) => {
                    if (index === 0) return "rgba(31, 119, 180, 0.8)"; // Income - blue
                    if (labels[index] === "Savings/Remaining") return "rgba(44, 160, 44, 0.8)"; // Savings - green
                    return "rgba(255, 127, 14, 0.8)"; // Expenses - orange
                })
            },
            link: {
                source: links.map((l) => l.source),
                target: links.map((l) => l.target),
                value: links.map((l) => l.value),
                color: links.map(() => "rgba(128, 128, 128, 0.4)")
            }
        };
    }

    function createChart() {
        if (!plotlyLoaded || !Plotly || !chartDiv) return;

        const plotData = [createSankeyDataFromExpenses(items, income)];

        Plotly.newPlot(chartDiv, plotData, {
            title: {
                text: "Income → Expenses Flow",
                font: { size: 18 }
            },
            font: { size: 14 },
            margin: { t: 50, l: 50, r: 50, b: 50 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
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

<div bind:this={chartDiv} class="w-full h-full bg-base-100 rounded-lg shadow-lg"></div>

{#if !plotlyLoaded}
    <div class="w-full h-full flex items-center justify-center bg-base-100 rounded-lg shadow-lg">
        <div class="loading loading-spinner loading-lg"></div>
        <span class="ml-2">Loading chart...</span>
    </div>
{/if}