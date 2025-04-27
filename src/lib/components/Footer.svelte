<script lang="ts">
	import { Footer, FooterLi, FooterUl, FooterCopyright } from 'svelte-5-ui-lib';
</script>

<Footer class="absolute bottom-0 shadow-none" footerType="logo">
	<div class="sm:flex sm:items-center sm:justify-between">
		<FooterCopyright href="/" by="Isaac Davies" year={2025} />
		<!-- <FooterUl
			class="mt-3 flex flex-wrap items-center text-sm text-gray-500 sm:mt-0 dark:text-gray-400"
		>
			<FooterLi href="/">About</FooterLi>
			<FooterLi href="/">Privacy Policy</FooterLi>
			<FooterLi href="/">Licensing</FooterLi>
			<FooterLi href="/">Contact</FooterLi>
		</FooterUl> -->
	</div>
</Footer>
