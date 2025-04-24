<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	let { form }: { form: ActionData } = $props();
</script>

<Tabs.Root value="login" class="flex w-1/3 justify-center">
	<Tabs.List>
		<Tabs.Trigger value="account">Login</Tabs.Trigger>
		<Tabs.Trigger value="password">Register</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="account">Make changes to your account here.</Tabs.Content>
	<Tabs.Content value="password">Change your password here.</Tabs.Content>
</Tabs.Root>

<!-- <h1 class="flex justify-center md:mt-50 md:mb-30">Login/Register</h1> -->

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
