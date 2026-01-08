<script>
	import { musicState, musicActions } from '$lib/pb.svelte.js';
	import { slide } from 'svelte/transition';

    let { title, originalList, hasChecked, onDelete, children } = $props(); // 제목으로 사용할 'title'만 받는다.
	
	// --- 내부 상태 (컴포넌트 안에 격리) ---
    let searchTerm = $state(''); 
    let sortOrder = $state('asc'); // 'asc' | 'desc'
	let count = $state(originalList?.length?? 0)

    // --- 파생 상태 (검색 및 정렬 로직 내장) ---
	let filteredList = $derived.by(() => {
        let list = [...originalList];
        if (searchTerm) {
            list = list.filter(item => 
                item.title?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        // 2. 정렬 로직 (제목 기준)
        list.sort((a, b) => {
            const multi = sortOrder === 'asc' ? 1 : -1;
            return a.title.localeCompare(b.title) * multi;
        });
        return list;
    });
    
	function sortOnTitle() {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'; // 상태 토글
        
        musicState.allMusics = [...musicState.allMusics].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.title.localeCompare(b.title);
            } else {
                return b.title.localeCompare(a.title);
            }
        });
    }

    
	//
</script>

<div class="list-view">
    <header class="list-header">
        <div class="title-area">
            <h3>{title} <span class="count">{count}</span></h3>
            <input type="text" bind:value={searchTerm} placeholder="검색..." class="search-input" />
        </div>
        
        <div class="action-buttons">
            <button class="sort-btn" onclick={sortOnTitle}>
                <span class="icon">⇅</span> 정렬
            </button>
            <button class="delete-btn"
				class:selected={hasChecked}
				onclick={onDelete}>
                체크된 항목들 제거
            </button>
        </div>
    </header>

    <div class="list-content">
		{#each filteredList as item (item.id)}
        	{@render children(item)}
		{/each}
    </div>
</div>

<style>
    /* 이미지에서 보신 레이아웃을 반영한 스타일 */
    .list-view { background: #fdfdfd; border-radius: 12px; padding: 15px; }
    .list-header { margin-bottom: 15px; }
    .title-area { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
    .count { background: #007bff; color: white; border-radius: 50%; padding: 2px 8px; font-size: 0.8rem; }
    .search-input { border: 1px solid #ddd; padding: 5px 10px; border-radius: 4px; width: 60%; }
    
    .action-buttons { display: flex; justify-content: flex-end; gap: 8px; }
    .sort-btn { background: #4caf50; color: white; border: none; border-radius: 4px; padding: 5px 12px; cursor: pointer; }
    .delete-btn { background: #f2dede; color: #a94442; border: none; border-radius: 4px; padding: 5px 12px; cursor: pointer; }
    
    .list-content { 
        display: flex; flex-direction: column; gap: 10px; 
        max-height: 700px; overflow-y: auto; /* 이미지의 스크롤바 반영 */
        padding-right: 5px;
    }
	.selected { background-color: #f856b4; color: black; border: 1px solid #8f407a; }
</style>