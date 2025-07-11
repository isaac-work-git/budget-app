<script lang="ts">
	let { name } = $props();
</script>

<div class="navbar rounded-b-xl shadow-xl bg-neutral text-neutral-content">
	<div class="navbar-start flex-1">
		<a href="/" class="btn btn-ghost text-xl">BUDGT</a>
	</div>

	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1">
			<li><a href="/">Dashboard</a></li>
			<li><a href="/expenses">Expenses</a></li>
		</ul>
	</div>

	<div class="navbar-end">
		<div class="dropdown dropdown-end">
		<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
			<div class="w-10 rounded-full">
			<img
				alt="Tailwind CSS Navbar component"
				src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
			</div>
		</div>
		<ul
			tabindex="0"
			class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
			<li>{name}</li>
			<li>
				<form method="POST" action="/logout">
					<button class="max-w-48 cursor-pointer">Sign out</button>
				</form>	
			</li>
		</ul>
		</div>
	</div>
</div>
