<script>
    // item: 곡 데이터, isChecked: 부모의 Set에 포함되었는지 여부
    let { item, isChecked = $bindable(), onEdit, onDelete, onToggle } = $props();
</script>

<div class="card editable-card" class:selected={isChecked}>
    <input type="checkbox" bind:checked={isChecked} 
        onchange ={(e)=> onToggle(item.id, e.target.checked)}
    />
    
    <div class="card-image">
        <img src={item.thumbUrl || item.image} alt={item.title} />
    </div>
    
    <div class="card-info">
        <div class="main-text">
            <strong>{item.title}</strong> : {item.singer}
        </div>
        <div class="sub-text">
            {item.genre} · {item.theme}
        </div>
        <div class="meta-text">
            👁️ {item.views || 0}
        </div>
    </div>
    
    <div class="card-actions">
        <button class="edit-icon" onclick={() => onEdit(item)}>✏️</button>
        <button class="delete-icon" onclick={() => onDelete(item.id)}>🗑️</button>
    </div>
</div>

<style>
    .card { display: flex; align-items: center; gap: 12px; padding: 10px; border: 1px solid #eee; border-radius: 12px; background: white; }
    
    .card-image img { width: 50px; height: 50px; border-radius: 8px; object-fit: cover; }
    .card-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .main-text { font-size: 0.95rem; }
    .sub-text { font-size: 0.8rem; color: #888; }
    .meta-text { font-size: 0.8rem; color: #666; }
    .card-actions { display: flex; gap: 5px; }
    .edit-icon, .delete-icon { background: #f8f9fa; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; padding: 3px 6px; }
    .selected { background-color: #f0f8ff; border: 1px solid #add8e6; }
</style>