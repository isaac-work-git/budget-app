<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { Tabs, TabItem, GradientButton } from 'svelte-5-ui-lib';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<Tabs
		tabStyle="pill"
		contentClass="p-6 bg-gray-100 rounded-b-xl shadow-md"
		ulClass="flex flex-nowrap self-center justify-center gap-2 rounded-t-6xl overflow-hidden bg-white p-2"
	>
		<TabItem open title="Login">
			<form method="post" action="?/login" use:enhance class="flex flex-col justify-center gap-6">
				<label>
					Username
					<input name="username" required />
				</label>
				<label class="mb-10">
					Password
					<input type="password" name="password" required />
				</label>
				<GradientButton shadow pill class="flex self-center active:bg-blue-600"
					>Login</GradientButton
				>
			</form>
			<p style="color: red">{form?.message ?? ''}</p>
		</TabItem>
		<TabItem title="Register">
			<form
				method="post"
				action="?/register"
				use:enhance
				class="flex flex-col justify-center gap-6"
			>
				<label>
					Username
					<input name="username" required />
				</label>
				<label class="mb-10">
					Password
					<input type="password" name="password" required />
				</label>
				<GradientButton shadow pill class="flex self-center active:bg-blue-600">
					Register
				</GradientButton>
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
</style>
