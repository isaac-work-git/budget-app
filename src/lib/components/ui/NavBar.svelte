<script lang="ts">
	import {
		Navbar,
		NavBrand,
		NavUl,
		NavLi,
		uiHelpers,
		NavHamburger,
		Dropdown,
		DropdownHeader,
		DropdownUl,
		DropdownLi,
		Avatar,
		DropdownFooter
	} from 'svelte-5-ui-lib';
	import { page } from '$app/stores';
	let activeUrl = $state($page.url.pathname);
	import { sineIn } from 'svelte/easing';
	let nav = uiHelpers();
	let navStatus = $state(false);
	let toggleNav = nav.toggle;
	let dropdownUser = uiHelpers();
	let dropdownUserStatus = $state(false);
	let closeDropdownUser = dropdownUser.close;
	$effect(() => {
		dropdownUserStatus = dropdownUser.isOpen;
		navStatus = nav.isOpen;
		activeUrl = $page.url.pathname;
	});
	let { name } = $props();
</script>

<div class="h-16 bg-gray-100 dark:bg-gray-900">
	<Navbar {navStatus} hamburgerMenu={false}>
		{#snippet brand()}
			<NavBrand
				siteName="BUDGT"
				spanClass="whitespace-nowrap text-xl font-semibold text dark:text-white"
			>
				<!-- <img width="30" src="" alt="Budget icon" /> -->
			</NavBrand>
		{/snippet}
		{#snippet navSlotBlock()}
			<div class="flex items-center space-x-1 md:order-2">
				<Avatar onclick={dropdownUser.toggle} src="" />
				<div class="relative">
					<Dropdown
						dropdownStatus={dropdownUserStatus}
						closeDropdown={closeDropdownUser}
						params={{ y: 0, duration: 200, easing: sineIn }}
						class="absolute top-[14px] -left-[110px] md:-left-[160px] "
					>
						<DropdownHeader class="px-4 py-2">
							<span class="block text-sm text-gray-900 dark:text-white">{name}</span>
						</DropdownHeader>
						<!-- <DropdownUl>
							<DropdownLi href="/">Dashboard</DropdownLi>
							<DropdownLi href="/components/drawer">Drawer</DropdownLi>
							<DropdownLi href="/components/footer">Footer</DropdownLi>
							<DropdownLi href="/components">Alert</DropdownLi>
						</DropdownUl> -->
						<DropdownFooter class="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">
							<form method="POST" action="/logout">
								<button class="max-w-48 cursor-pointer">Sign out</button>
							</form>
						</DropdownFooter>
					</Dropdown>
				</div>
				<NavHamburger {toggleNav} />
			</div>
		{/snippet}
		<NavUl class="order-1" {activeUrl}>
			<NavLi href="/dashboard">Dashboard</NavLi>
		</NavUl>
	</Navbar>
</div>
