<script>
    let { item, isActive, isPlaying, handlePlay } = $props();

    // 이미지 경로 로직
    const imgUrl = $derived(item.thumbUrl);
</script>

<button class="music-card-item" class:active={isActive} onclick={()=>handlePlay(item)}>
    <div class="img-wrapper">
        <img src={imgUrl} alt={item.title} />
    </div>

    <div class="card-body">
        <div class="title">{item .title} : {item .singer}</div>
        <div class="meta">{item .genre} · 👁️ {item .viewed || 0}</div>
    </div>

    <div class="play-control-btn">
        {#if isActive && isPlaying}
            <span class="icon">⏸️</span>
        {:else}
            <span class="icon">▶️</span>
        {/if}
    </div>
</button>

<style>
    .music-card-item {
        display: flex; align-items: center; justify-content: space-between;
        gap: 15px; padding: 12px; margin-bottom: 10px;
        background: #f9f9f9; border-radius: 12px; transition: all 0.2s ease;
        border: 1px solid transparent; width: 100%; cursor: pointer; text-align: left;
    }
    .music-card-item:hover { background: #f0f0f0; }
    .music-card-item.active { 
        background: #e8f5e9; border-color: #4caf50; 
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.1);
    }
    .img-wrapper { 
        flex-shrink: 0; width: 50px; height: 50px; 
        border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
    .card-body { flex: 1; overflow: hidden; }
    .card-body .title { 
        font-weight: 600; font-size: 0.95rem; color: #333;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .card-body .meta { font-size: 0.8rem; color: #777; margin-top: 2px; }
    .play-control-btn {
        flex-shrink: 0; background: white; border: 1px solid #ddd; 
        width: 36px; height: 36px; border-radius: 50%; 
        display: flex; align-items: center; justify-content: center; font-size: 0.8rem;
    }
</style>