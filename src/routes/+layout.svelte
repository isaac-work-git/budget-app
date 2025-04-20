<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<nav>
	<!-- <a href="/">Dashboard</a> -->
	<a href="/dashboard">Dashboard</a>
</nav>

{@render children()}
