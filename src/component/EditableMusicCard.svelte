<script>
    import { musicUI } from "../store/musicUI.svelte";
	import { musicFormUI } from "../store/musicFormUI.svelte"; 
    let { item } = $props();

    const info = $derived(musicUI.getDisplayInfo(item));
    const isChecked = $derived(musicFormUI.isChecked(item.id));
</script>

<div class="music-card-item" class:is-checked={isChecked}>
    <label class="check-container">
        <input type="checkbox" checked={isChecked} onchange={() => musicFormUI.toggleCheck(item.id)} />
    </label>

    <div class="img-box">
        <img src={info.image} alt="" />
    </div>

    <div class="text-box">
        <div class="main-title">{info.mainText}</div>
        <div class="sub-info">{info.subText} <span class="meta">{info.meta}</span></div>
    </div>

    <div class="btn-group">
        <button class="edit" onclick={() => musicFormUI.handleEdit(item)}>✏️</button>
        <button class="del" onclick={() => musicFormUI.deleteSelected(item.id)}>🗑️</button>
    </div>
</div>

<style>
    .music-card-item { 
        display: flex; align-items: center; gap: 12px; padding: 12px; 
        background: white; border-radius: 8px; margin-bottom: 8px; border: 1px solid #eee;
    }
    /* .music-card-item {
        display: flex; align-items: center; justify-content: space-between;
        gap: 15px; padding: 12px; margin-bottom: 10px;
        background: #f9f9f9; border-radius: 12px; transition: all 0.2s ease;
        border: 1px solid transparent; width: 100%; cursor: pointer; text-align: left;
    } */
    .music-card-item:hover { 
        background: #e6e8e7; 
        transform: translateY(-0.7px); transition: 0.2s;
        /* background-color: #fcfcfc; 아주 살짝 밝아지는 느낌 */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* 아주 연한 그림자 */
        border-color: #eee; /* 테두리도 은근하게 강조 */
    }
    .music-card-item.is-checked { background: #e8f5e9; border-color: #4caf50; }
    .img-box { width: 40px; height: 40px; border-radius: 4px; overflow: hidden; background: #eee; }
    .img-box img { width: 100%; height: 100%; object-fit: cover; }
    .text-box { flex: 1; min-width: 0; }
    .main-title { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sub-info { font-size: 0.8rem; color: #666; }
    .btn-group button { background: none; border: 1px solid #ddd; border-radius: 4px; padding: 4px 8px; cursor: pointer; }
    .btn-group button:hover { background: #f0f0f0; }
</style>