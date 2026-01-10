<script>
    import { musicUI } from "../store/musicUI.svelte";
    let { item } = $props();

    // musicUI의 공통 변환 로직 사용 (이미지 URL, 텍스트 등)
    const info = $derived(musicUI.getDisplayInfo(item));
    const isCurrent = $derived(musicUI.isCurrent(item.id));
</script>

<button class="rec-item" class:active={isCurrent} onclick={() => musicUI.handlePlay(item)}>
    <img src={info.image} alt={info.mainText} />
    <span title={info.mainText}>{info.mainText}</span>
</button>

<style>
    .rec-item { 
        border: 2px solid transparent; 
        background: none; 
        cursor: pointer; 
        display: flex; 
        flex-direction: column; 
        gap: 5px; 
        text-align: left; 
        padding: 4px;
        border-radius: 8px;
        transition: all 0.2s;
    }
    .rec-item:hover { background: #f0f0f0; }
    .rec-item.active { border-color: #4caf50; background: #e8f5e9; }
    
    .rec-item img { 
        width: 100%; 
        aspect-ratio: 16/9; 
        object-fit: cover; 
        border-radius: 6px; 
    }
    .rec-item span { 
        font-size: 0.8rem; 
        font-weight: 500;
        white-space: nowrap; 
        overflow: hidden; 
        text-overflow: ellipsis; 
    }
</style>