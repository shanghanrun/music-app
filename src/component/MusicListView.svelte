<script>
    import { musicUI } from "../store/musicUI.svelte";
    let { children } = $props();
</script>

<div class="music-list-wrapper">
    <header>
        <div class="title-row">
            <h3>{musicUI.title} <span class="count-badge">{musicUI.list.length}</span></h3>
            
            <div class="controls">
				<select class="sort-select" bind:value={musicUI.sortKey}>
					<option value="title">제목</option>
					<option value="created">생성일</option>
					<option value="viewed">조회수</option>
				</select>

				<button class="sort-apply-btn" onclick={() => musicUI.applySort()}>
					정렬 실행 
					<span>{musicUI.sortOrder === 'asc' ? '▲' : '▼'}</span>
				</button>
			</div>
        </div>

        <div class="search-row">
            <input type="text" 
                   class="search-bar" 
                   bind:value={musicUI.searchTerm} 
                   placeholder="노래 제목이나 가수 검색..." />
        </div>

        {#if musicUI.hasChecked}
            <div class="batch-action-bar">
                <span>{musicUI.selectedCount}개 선택됨</span>
                <button onclick={() => musicUI.deleteSelected()}>일괄 삭제</button>
                <button onclick={() => musicUI.cancelSelected()}>일괄 취소</button>
            </div>
        {/if}
    </header>
    
    <div class="card-container">
        {@render children?.()}
    </div>
</div>

<style>
    .music-list-wrapper { padding: 16px; display: flex; flex-direction: column; height: 100%; background: #fff; }
    
    .title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    
    .controls { display: flex; gap: 5px; align-items: center; }
    .sort-select { padding: 6px; border-radius: 4px; border: 1px solid #ddd; }
    .sort-apply-btn { 
        padding: 6px 12px; border-radius: 4px; border: 1px solid #4caf50;
        background: white; color: #4caf50; cursor: pointer; font-weight: bold;
    }
    .sort-apply-btn:hover { background: #f0fdf4; }

    .search-row { margin-bottom: 15px; }
    .search-bar { width: 97.5%; padding: 12px; border-radius: 8px; border: 1px solid #eee; background: #f5f5f5; }

    .card-container { flex: 1; overflow-y: auto; }
    
    .count-badge { background: #4caf50; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem; margin-left: 5px; }

    .batch-action-bar { 
        background: #fff3f3; padding: 10px; border-radius: 6px; 
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 10px; border: 1px solid #ffebeb;
    }
</style>