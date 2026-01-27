<script>
    import { musicUI } from "../store/musicUI.svelte";
    import { musicFormUI } from "../store/musicFormUI.svelte";
    let { children } = $props();

    // 재생 모드별 버튼 스타일 클래스
    const getModeClass = (mode) => musicUI.playMode === mode ? 'active' : '';
</script>

<div class="music-list-wrapper">
    <header>
        <div class="title-row">
            <h3>{musicUI.title} <span class="count-badge">{musicUI.list.length}</span></h3>

            <div class="play-mode-group">
                <button class={getModeClass('linear')} onclick={() => musicUI.playMode = 'linear'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
                </button>
                
                <button class={getModeClass('shuffle')} onclick={() => musicUI.playMode = 'shuffle'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/></svg>
                </button>
                
                <button class={getModeClass('standard')} onclick={() => musicUI.playMode = 'standard'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                </button>
            </div>

            <!-- <div class="play-mode-group">
                <button class={getModeClass('linear')} onclick={() => musicUI.playMode = 'linear'}>연속</button>
                <button class={getModeClass('shuffle')} onclick={() => musicUI.playMode = 'shuffle'}>셔플</button>
                <button class={getModeClass('standard')} onclick={() => musicUI.playMode = 'standard'}>표준</button>
            </div>             -->
        </div>

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

        <div class="search-row">
            <input type="text" 
                   class="search-bar" 
                   bind:value={musicUI.searchTerm} 
                   placeholder="노래 제목이나 가수 검색..." />
        </div>

        {#if musicFormUI.hasChecked}
            <div class="batch-action-bar">
                <span class="batch-count">{musicFormUI.selectedCount}개 선택됨</span>
                <div class="batch-btns">
                    <button class="del-btn" onclick={() => musicFormUI.deleteSelected()}>일괄 삭제</button>
                    <button class="cancel-btn" onclick={() => musicFormUI.cancelSelected()}>일괄 취소</button>
                </div>
            </div>
        {/if}
    </header>
    
    <div class="card-container">
        {@render children?.()}
    </div>
</div>

<style>
    /* 모든 요소에 padding이 너비에 포함되도록 설정 (매우 중요!) */
    * { box-sizing: border-box; }

    /* 1. 전체를 감싸는 래퍼에 좌우 여백을 강제로 부여합니다. */
    .music-list-wrapper { 
        padding: 16px; 
        display: flex; 
        flex-direction: column; 
        height: 100%; 
        background: #fff; 
        /* ⭐️ 핵심: 너비를 100%가 아니라 화면보다 조금 작게 잡고 중앙 정렬합니다. */
        max-width: 460px; /* 형님이 보기에 적당한 너비로 조절하세요 */
        margin: 0 auto;  /* 가운데 정렬 */
    }
    
    .title-row { 
        display: flex; 
        justify-content: space-between; 
        flex-wrap: wrap; /* 공간 부족 시 다음 줄로 넘어가되 겹치지 않게 */
        align-items: center; 
        margin-bottom: 16px; 
    }

    h3 { margin: 0; font-size: 1.2rem; white-space: nowrap; }

    /* 재생 모드 버튼 그룹 */
    .play-mode-group { display: flex; gap: 4px; }
    .play-mode-group button {
        padding: 4px 10px;
        border-radius: 6px;
        border: 1px solid #ddd;
        background: #f9f9f9;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s;
    }
    .play-mode-group button.active {
        background: #4caf50;
        color: white;
        border-color: #4caf50;
    }
    .play-mode-group button:hover {
        background: #9ad8ab;
    }
    
    .controls { display: flex; gap: 8px; margin-bottom: 12px; }
    .sort-select { 
        padding: 8px; 
        border-radius: 8px; 
        border: 1px solid #eee; 
        background: #fff;
        flex: 1; /* 셀렉트 박스가 남는 공간 차지 */
    }
    .sort-apply-btn { 
        flex: 1;
        padding: 8px 12px; 
        border-radius: 8px; 
        border: 1px solid #4caf50;
        background: white; 
        color: #4caf50; 
        font-weight: bold;
    }

    .search-row { 
        margin-bottom: 16px; }
    .search-bar { 
        width: 100%; /* 97.5% 대신 100% 사용 */
        padding: 12px 16px; 
        border-radius: 10px; 
        border: 1px solid #eee; 
        background: #f8f9fa;
        font-size: 1rem;
    }

    .card-container { 
        flex: 1; 
        overflow-y: auto; 
        padding-right: 4px; /* 스크롤바와 카드 사이 간격 */
    }
    
    .count-badge { background: #4caf50; color: white; padding: 2px 8px; border-radius: 20px; font-size: 0.75rem; }

    /* 일괄 작업 바 개선 */
    .batch-action-bar { 
        background: #fff0f0; 
        padding: 12px; 
        border-radius: 10px; 
        display: flex; 
        justify-content: space-between; 
        align-items: center;
        margin-bottom: 12px; 
        border: 1px solid #ffdada;
    }
    .batch-count { font-weight: bold; color: #e53935; }
    .batch-btns { display: flex; gap: 6px; }
    .batch-btns button { padding: 6px 10px; border-radius: 6px; border: none; font-size: 0.8rem; cursor: pointer; }
    .del-btn { background: #ff5252; color: white; }
    .cancel-btn { background: #9e9e9e; color: white; }

    /* 모바일 대응 미디어 쿼리 */
    @media (max-width: 480px) {
        .music-list-wrapper { padding: 12px; }
        .title-row { flex-direction: column; align-items: flex-start; gap: 10px; }
        .play-mode-group { width: 100%; justify-content: space-between; }
        .play-mode-group button { flex: 1; text-align: center; width: 50px; }
    }
</style>