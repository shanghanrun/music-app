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
    .music-card-item.is-checked { background: #e8f5e9; border-color: #4caf50; }
    .img-box { width: 40px; height: 40px; border-radius: 4px; overflow: hidden; background: #eee; }
    .img-box img { width: 100%; height: 100%; object-fit: cover; }
    .text-box { flex: 1; min-width: 0; }
    .main-title { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sub-info { font-size: 0.8rem; color: #666; }
    .btn-group button { background: none; border: 1px solid #ddd; border-radius: 4px; padding: 4px 8px; cursor: pointer; }
    .btn-group button:hover { background: #f0f0f0; }
</style>