<script>
    import { musicState, musicActions } from '$lib/pb.svelte.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let searchTerm = $state('');
    let currentMusic = $state(null);
    let isPlaying = $state(false); 
    let lastViewTime = 0; 

    onMount(async () => {
        await musicActions.init();
        if (musicState.allMusics.length > 0) {
            currentMusic = musicState.allMusics[0];
        }
    });

    // 재생 및 곡 선택 통합 핸들러
    async function handlePlay(music) {
        const now = Date.now();

        if (currentMusic?.id === music.id) {
            // 같은 곡 클릭 시 재생/일시정지만 토글
            isPlaying = !isPlaying;
        } else {
            // 다른 곡 클릭 시 곡 변경 및 재생 시작
            currentMusic = music;
            isPlaying = true;

            // 조회수 증가 (3초 디바운스)
            if (now - lastViewTime > 3000) {
                lastViewTime = now;
                await musicActions.updateMusic(music.id, { 
                    viewed: (music.viewed || 0) + 1 
                });
                music.viewed = (music.viewed || 0) + 1;
            }
        }
    }

    let filteredMusics = $derived(
        musicState.allMusics.filter(m => 
            m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.singer.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    let relatedMusics = $derived(
        musicState.allMusics
            .filter(m => currentMusic && m.theme === currentMusic.theme && m.id !== currentMusic.id)
            .slice(0, 6)
    );

    function getEmbedUrl(url, play) {
        if (!url) return '';
        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
        const params = play ? `?autoplay=1&mute=0&enablejsapi=1` : '';
        return `https://www.youtube.com/embed/${videoId}${params}`;
    }
</script>

<div class="user-container">
    <section class="col list-col">
        <header>
            <h3>Music List <span class="count-badge">{filteredMusics.length}</span></h3>
            <div class="search-wrapper">
                <input type="text" class="search-bar" bind:value={searchTerm} placeholder="검색..." />
            </div>
        </header>
        <div class="card-container">
            {#each filteredMusics as music (music.id)}
                <button class="music-card-item" 
                        class:active={currentMusic?.id === music.id}
                        onclick={() => handlePlay(music)}>
                    
                    <div class="img-wrapper">
                        <img src={music.image ? `https://chois.cloud/api/files/musics/${music.id}/${music.image}` : music.thumbUrl} alt="" />
                    </div>

                    <div class="card-body">
                        <div class="title">{music.title} : {music.singer}</div>
                        <div class="meta">{music.genre} · 👁️ {music.viewed || 0}</div>
                    </div>

                    <div class="play-control-btn">
                        {#if currentMusic?.id === music.id && isPlaying}
                            <span class="icon">⏸️</span>
                        {:else}
                            <span class="icon">▶️</span>
                        {/if}
                    </div>
                </button>
            {/each}
        </div>
    </section>

    <section class="col main-col">
        {#if currentMusic}
            <div class="player-container">
                <div class="player-ratio">
                    {#if isPlaying}
                        <iframe 
                            src={getEmbedUrl(currentMusic.src, true)} 
                            title="player" 
                            allow="autoplay; encrypted-media" 
                            allowfullscreen>
                        </iframe>
                    {:else}
                        <div class="player-placeholder">
                            <img src={currentMusic.image ? `https://chois.cloud/api/files/musics/${currentMusic.id}/${currentMusic.image}` : currentMusic.thumbUrl} alt="" />
                        </div>
                    {/if}
                </div>
            </div>
            <div class="main-info">
                <h2>
                    <span>{currentMusic.title}</span>
                    <span class="singer-name"> : {currentMusic.singer}</span>
                </h2>
                <div class="tags">
                    <span>#{currentMusic.genre}</span>
                    <span>#{currentMusic.theme}</span>
                </div>
                <div class="recommend-section">
                    <h4>Similar Theme: {currentMusic.theme}</h4>
                    <div class="recommend-grid">
                        {#each relatedMusics as rm}
                            <button class="rec-item" onclick={() => handlePlay(rm)}>
                                <img src={rm.image ? `https://chois.cloud/api/files/musics/${rm.id}/${rm.image}` : rm.thumbUrl} alt="" />
                                <span>{rm.title}</span>
                            </button>
                        {/each}
                    </div>
                </div>
            </div>
        {/if}
    </section>

    <section class="col detail-col">
        {#if currentMusic}
            <div class="detail-header">
                <h3>Lyrics & Notes</h3>
                <button onclick={()=> goto('/admin')}>Admin 페이지</button>
            </div>
            <div class="scroll-content">
                <div class="lyric-section">
                    <label>Original</label>
                    <pre>{currentMusic.lyric || '가사 없음'}</pre>
                </div>
                <div class="lyric-section">
                    <label>Translation</label>
                    <pre>{currentMusic.koLyric || '번역 없음'}</pre>
                </div>
                {#if currentMusic.etc}
                    <div class="etc-section">
                        <label>Admin's Note</label>
                        <div class="etc-content">{currentMusic.etc}</div>
                    </div>
                {/if}
            </div>
        {/if}
    </section>
</div>

<style>
    .user-container { 
        display: grid; 
        grid-template-columns: 1.5fr 2fr 2fr; 
        gap: 16px; padding: 16px; height: 100vh; 
        background: #f0f2f5; box-sizing: border-box;
    }

    section.col { 
        background: white; border-radius: 12px; 
        display: flex; flex-direction: column; overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }

    /* 좌측 검색 및 목록 스타일 */
    .list-col { padding: 16px; }
    .search-wrapper { width: 100%; box-sizing: border-box; padding-top: 8px; }
    .search-bar { 
        width: 100%; padding: 10px; border-radius: 6px; 
        border: 1px solid #ddd; box-sizing: border-box;
    }
    .card-container { flex: 1; overflow-y: auto; margin-top: 10px; }

    /* 음악 카드 스타일 (버튼화 및 정렬) */
    .music-card-item {
        display: flex; 
        align-items: center; 
        justify-content: space-between; /* 이미지 - 텍스트 - 버튼 간격 띄움 */
        gap: 15px; 
        padding: 12px;
        margin-bottom: 10px;
        background: #f9f9f9; 
        border-radius: 12px; 
        transition: all 0.2s ease;
        border: 1px solid transparent;
        width: 100%;
        cursor: pointer;
        text-align: left;
    }

    .music-card-item:hover { background: #f0f0f0; }
    .music-card-item.active { 
        background: #e8f5e9; 
        border-color: #4caf50; 
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.1);
    }

    .img-wrapper { 
        flex-shrink: 0;
        width: 50px; height: 50px; 
        border-radius: 8px; overflow: hidden; 
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .img-wrapper img { width: 100%; height: 100%; object-fit: cover; }

    .card-body { 
        flex: 1; /* 중간 공간을 꽉 채워서 양옆 요소를 밀어냄 */
        overflow: hidden;
    }
    .card-body .title { 
        font-weight: 600; font-size: 0.95rem; color: #333;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .card-body .meta { font-size: 0.8rem; color: #777; margin-top: 2px; }

    .play-control-btn {
        flex-shrink: 0;
        background: white; border: 1px solid #ddd; 
        width: 36px; height: 36px;
        border-radius: 50%; display: flex; 
        align-items: center; justify-content: center;
        font-size: 0.8rem;
    }

    /* 중앙 플레이어 스타일 */
    .player-container { width: 100%; background: #000; }
    .player-ratio { position: relative; width: 100%; padding-top: 56.25%; }
    .player-ratio iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }
    .player-placeholder { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #000; }
    .player-placeholder img { width: 100%; height: 100%; object-fit: cover; opacity: 0.6; }

    .main-info { padding: 20px; overflow-y: auto; }
    .singer-name { font-weight: normal; color: #666; font-size: 1.2rem; }
    .tags { margin: 10px 0; color: #4caf50; font-weight: 600; font-size: 0.9rem; }
    
    .recommend-section { margin-top: 24px; }
    .recommend-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px; }
    .rec-item { border: none; background: none; cursor: pointer; display: flex; flex-direction: column; gap: 5px; text-align: left; }
    .rec-item img { width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 6px; }
    .rec-item span { font-size: 0.8rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* 우측 가사/노트 스타일 (세로 1/4 고정) */
    .detail-header { padding: 16px; border-bottom: 1px solid #eee; }
    .scroll-content { padding: 16px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 20px; }
    .lyric-section, .etc-section { display: flex; flex-direction: column; }
    .lyric-section label, .etc-section label { 
        display: block; font-size: 0.75rem; color: #888; 
        text-transform: uppercase; margin-bottom: 6px; font-weight: bold;
    }
    pre, .etc-content { 
        height: 22vh; overflow-y: auto; 
        background: #f8f9fa; padding: 15px; 
        border-radius: 8px; margin: 0;
        white-space: pre-wrap; font-family: inherit; 
        font-size: 0.95rem; line-height: 1.6; border: 1px solid #eee;
    }
    .etc-content { background: #fffdf0; border-color: #f0e68c; }

    /* 스크롤바 커스텀 */
    pre::-webkit-scrollbar, .etc-content::-webkit-scrollbar, .card-container::-webkit-scrollbar { width: 6px; }
    pre::-webkit-scrollbar-thumb, .etc-content::-webkit-scrollbar-thumb, .card-container::-webkit-scrollbar-thumb { 
        background: #ddd; border-radius: 10px; 
    }

    .count-badge { background: #4caf50; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem; }
</style>