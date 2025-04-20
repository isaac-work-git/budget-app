<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<h1 class="flex justify-center md:mt-50 md:mb-30">Login/Register</h1>

<form method="post" action="?/login" use:enhance class="flex flex-col justify-center gap-6">
	<label>
		Username
		<input name="username" required />
	</label>
	<label class="mb-10">
		Password
		<input type="password" name="password" required />
	</label>
	<section class="flex justify-center gap-6">
		<button class="max-w-48 hover:bg-blue-500 hover:text-white active:bg-blue-600">Login</button>
		<button
			formaction="?/register"
			class="max-w-48 hover:bg-blue-500 hover:text-white active:bg-blue-600">Register</button
		>
	</section>
</form>
<p style="color: red">{form?.message ?? ''}</p>

<style>
	label {
		display: flex;
		justify-content: center;
		gap: var(--spacing);
	}

	button {
		display: flex;
		border-radius: 10px;
		border: 2px solid black;
		padding: calc(var(--spacing) * 4);
		width: 100%;
		align-self: center;
	}

	input {
		border-radius: 10px;
		border: 2px solid black;
	}
</style>
