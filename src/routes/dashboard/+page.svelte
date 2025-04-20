<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<h1 class="flex md:mt-30 md:mb-20">Hi, {data.user.username}!</h1>
<p class="pb-10">Your user ID is {data.user.id}.</p>
<form method="post" action="?/logout" use:enhance>
	<button class="max-w-48 hover:bg-blue-500 hover:text-white active:bg-blue-600">Sign out</button>
</form>

<style>
	h1,
	p,
	form {
		display: flex;
		padding: 0 0 0 2rem;
	}
	button {
		display: flex;
		border-radius: 10px;
		border: 2px solid black;
		padding: calc(var(--spacing) * 4);
		width: 100%;
		align-self: center;
	}
</style>
