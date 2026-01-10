<script>
    import { goto } from '$app/navigation';
	import { musicUI } from '../store/musicUI.svelte';
	let { children } = $props(); 

</script>

<section class="music-info-container">
    {#if musicUI.currentMusic}
        <div class="info-header">
            <h3>Lyrics & Notes</h3>
            <div class="header-actions">
                <button class="admin-btn" on:click={() => goto('/admin')}>Admin</button>
            </div>
        </div>
		<div class="card-container">
        	{@render children?.()}
    	</div>
        
    {:else}
        <div class="empty-state">
            곡을 선택하면 상세 정보가 표시됩니다.
        </div>
    {/if}
</section>

<style>
    .music-info-container {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .info-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
    }
    .info-header h3 {
        margin: 0;
        font-size: 1.2rem;
    }
    .admin-btn {
        padding: 6px 12px;
        font-size: 0.8rem;
        background: #eee;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    .admin-btn:hover {
        background: #ddd;
    }
    .empty-state {
        color: #999;
        text-align: center;
        padding: 40px 0;
    }
</style>