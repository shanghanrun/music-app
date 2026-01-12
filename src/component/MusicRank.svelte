<script>
	import { musicActions } from '$lib/pb.svelte';
	import { goto } from '$app/navigation';
	import { musicUI } from '../store/musicUI.svelte';
	let { children } = $props()
</script>

<section class="popular-section">
	<header>
		<h3>인기 TOP 5</h3>
		<button class="refresh-btn" onclick={() => musicActions.init()}>업데이트</button>
		<button class="home-btn" onclick={() => goto('/')}>Home</button>
	</header>
	<ul class="top-list">
		{@render children?.()}
	</ul>
</section>

<style>
	header { 
        flex-shrink: 0; margin-bottom: 20px; border-bottom: 2px solid #f0f2f5; padding-bottom: 12px;
    }
    header h3 { margin: 0; font-size: 1.2rem; color: #1f1f1f; display: flex; align-items: center; }
	.top-list li { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f2f5; }

</style>