<script>
    let { title, list, children } = $props();
    let searchTerm = $state('');

    // 내부 검색 로직
    let filteredList = $derived(
        list.filter(m => 
            m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.singer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.genre.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
</script>

<div class="list-col-container">
    <header>
        <h3>{title} <span class="count-badge">{filteredList.length}</span></h3>
        <div class="search-wrapper">
            <input type="text" class="search-bar" bind:value={searchTerm} placeholder="검색..." />
        </div>
    </header>
    
    <div class="card-container">
        {#each filteredList as item (item.id)}
            {@render children(item)}
        {/each}
    </div>
</div>

<style>
    .list-col-container { padding: 16px; display: flex; flex-direction: column; height: 100%; }
    .search-wrapper { width: 100%; padding-top: 8px; }
    .search-bar { width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ddd; }
    .card-container { flex: 1; overflow-y: auto; margin-top: 10px; }
    .count-badge { background: #4caf50; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem; }
</style>