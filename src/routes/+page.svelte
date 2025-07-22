<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { LockOutline, UserOutline } from 'flowbite-svelte-icons';
	import { writable } from 'svelte/store';

	let { form }: { form: ActionData } = $props();
	const activeTab = writable<'login' | 'register'>('login');
</script>

<div class="flex h-screen flex-col items-center justify-center px-4">
	<div class="tabs tabs-boxed mb-4" role="tablist">
		<button
			role="tab"
			type="button"
			tabindex="0"
			class={`tab ${$activeTab === 'login' ? 'tab-active' : ''}`}
			onclick={() => activeTab.set('login')}
		>
			Login
		</button>
		<button
			role="tab"
			type="button"
			tabindex="0"
			class={`tab ${$activeTab === 'register' ? 'tab-active' : ''}`}
			onclick={() => activeTab.set('register')}
		>
			Register
		</button>
	</div>

	{#if $activeTab === 'login'}
		<form method="POST" action="?/login" use:enhance class="w-full max-w-sm">
			<fieldset class="bg-base-200 border border-base-300 rounded-box p-6 shadow">
				<legend class="text-lg font-bold mb-4">Login</legend>

				<label class="label" for="login-username">Username</label>
				<label class="input mb-4" for="login-username">
					<UserOutline class="h-4 w-4" />
					<input id="login-username" name="username" type="text" placeholder="Username" required />
				</label>

				<label class="label" for="login-password">Password</label>
				<label class="input mb-4" for="login-password">
					<LockOutline class="h-4 w-4" />
					<input id="login-password" name="password" type="password" placeholder="Password" required />
				</label>

				<button class="btn btn-primary w-full" formaction="?/login">Login</button>
			</fieldset>
			<p class="mt-2 text-center font-semibold text-red-500">{form?.message ?? ''}</p>
		</form>
	{/if}

	{#if $activeTab === 'register'}
		<form method="POST" action="?/register" use:enhance class="w-full max-w-sm">
			<fieldset class="bg-base-200 border border-base-300 rounded-box p-6 shadow">
				<legend class="text-lg font-bold mb-4">Register</legend>

				<label class="label" for="register-username">Username</label>
				<label class="input mb-4" for="register-username">
					<UserOutline class="h-4 w-4" />
					<input id="register-username" name="username" type="text" placeholder="Username" required />
				</label>

				<label class="label" for="register-password">Password</label>
				<label class="input mb-4" for="register-password">
					<LockOutline class="h-4 w-4" />
					<input id="register-password" name="password" type="password" placeholder="Password" required />
				</label>

				<button class="btn btn-outline btn-primary w-full" formaction="?/register">Register</button>
			</fieldset>
			<p class="mt-2 text-center font-semibold text-red-500">{form?.message ?? ''}</p>
		</form>
	{/if}
</div>
