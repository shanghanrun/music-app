<script>
	import { musicActions } from '$lib/pb.svelte';
	import { goto } from '$app/navigation';
	import { musicUI } from '../store/musicUI.svelte';
	let { children } = $props()

	// console.log('totalVisits : ', musicUI.totalVisits)
</script>

<section class="popular-section">
	<header>
		<h3>인기 TOP 5</h3>
		<button class="refresh-btn" onclick={() => musicActions.init()}>업데이트</button>
		<button class="home-btn" onclick={() => goto('/')}>Home</button>
		<span class="total-visits">총 방문자수 : {musicUI.totalVisits} 명</span>
	</header>
	<div class="top-list">
		{@render children?.()}
	</div>
</section>

<style>
	/* .top-list{
		width: 100%;
	} */
	header { 
        flex-shrink: 0; margin-bottom: 20px; border-bottom: 2px solid #f0f2f5; padding-bottom: 12px;
    }
    header h3 { margin: 0; font-size: 1.2rem; color: #1f1f1f;
		 display: flex; align-items: center; 
		margin-bottom: 5px;
	}
	
	.refresh-btn{
		background: rgb(94, 140, 247);
		border-radius: 8px;
		border: none;
		padding: 5px;
		margin-right: 10px;
	}
	.home-btn{
		background: rgb(25, 217, 25);
		border-radius: 8px;
		border: none;
		padding: 6px;
	}
	.refresh-btn:hover{
		background: rgb(61, 116, 244);
	}
	.home-btn:hover{
		background: rgb(18, 166, 18);
	}
	.total-visits{
		margin-left: 10px;
		color: rgb(58, 58, 253)
	}

</style>