<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { Tabs, TabItem, Label, Input } from 'svelte-5-ui-lib';
	import { UserOutline } from 'flowbite-svelte-icons';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<Tabs
		tabStyle="pill"
		contentClass="p-6 bg-gray-100 rounded-b-xl shadow-md dark:text-white"
		ulClass="flex flex-nowrap self-center justify-center gap-2 rounded-t-6xl overflow-hidden p-2"
	>
		<TabItem open title="Login">
			<form method="POST" action="?/login" use:enhance class="flex flex-col justify-center gap-10">
				<Label for="username">
					Username
					<Input name="username" class="pl-10" required>
						{#snippet left()}
							<UserOutline class="h-4 w-4" />
						{/snippet}
					</Input>
				</Label>
				<Label for="password">
					Password
					<Input type="password" name="password" class="pl-10" required />
				</Label>
				<button class="flex cursor-pointer" formaction="?/login"> Login </button>
			</form>
			<p class="mt-2 text-center font-semibold text-red-500">{form?.message ?? ''}</p>
		</TabItem>
		<TabItem title="Register">
			<form
				method="POST"
				action="?/register"
				use:enhance
				class="flex flex-col justify-center gap-10"
			>
				<Label for="username">
					Username
					<Input name="username" class="pl-10" required>
						{#snippet left()}
							<UserOutline class="h-4 w-4" />
						{/snippet}
					</Input>
				</Label>
				<Label for="password">
					Password
					<Input type="password" name="password" class="pl-10" required />
				</Label>
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
