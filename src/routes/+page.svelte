<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { Tabs, TabItem } from 'svelte-5-ui-lib';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<Tabs
		tabStyle="pill"
		contentClass="p-6 bg-gray-100 rounded-b-xl shadow-md"
		ulClass="flex flex-nowrap self-center justify-center gap-2 rounded-t-6xl overflow-hidden bg-white p-2"
	>
		<TabItem open title="Login">
			<form method="POST" action="?/login" use:enhance class="flex flex-col justify-center gap-10">
				<label>
					Username
					<input name="username" required />
				</label>
				<label>
					Password
					<input type="password" name="password" required />
				</label>
				<button class="flex cursor-pointer" formaction="?/login"> Login </button>
			</form>
			<p style="color: red">{form?.message ?? ''}</p>
		</TabItem>
		<TabItem title="Register">
			<form
				method="POST"
				action="?/register"
				use:enhance
				class="flex flex-col justify-center gap-10"
			>
				<label>
					Username
					<input name="username" required />
				</label>
				<label>
					Password
					<input type="password" name="password" required />
				</label>
				<button
					class="flex cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-blue-600"
					formaction="?/register"
				>
					Register
				</button>
			</form>
			<p class="mt-2 text-center font-semibold text-red-500">{form?.message ?? ''}</p>
		</TabItem>
	</Tabs>
</div>

<style>
	label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-weight: 600;
		color: #333;
	}

	input {
		border-radius: 10px;
		border: 2px solid #ccc;
		padding: 0.5rem 1rem;
		background-color: white;
		transition: border 0.2s;
	}

	input:focus {
		border-color: #3b82f6; /* blue-500 */
		outline: none;
	}

	button {
		display: flex;
		border-radius: 9999px;
		border: 2px solid var(--color-primary-500);
		padding: calc(var(--spacing) * 4);
		width: 50%;
		align-self: center;
		justify-content: center;
	}

	button:hover {
		background-color: var(--color-primary-500);
		color: white;
	}

	button:active {
		background-color: var(--color-primary-700);
		color: white;
	}
</style>
