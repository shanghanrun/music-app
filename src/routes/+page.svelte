<script>
    import { musicUI } from "../store/musicUI.svelte"; 
    import { musicActions } from "$lib/pb.svelte"; 
    import { onMount } from 'svelte';

    import MusicListView from "../component/MusicListView.svelte";
    import MusicCard from "../component/MusicCard.svelte";
    import MusicVideoPlayer from "../component/MusicVideoPlayer.svelte";
    import RelatedMusicContainer from "../component/RelatedMusicContainer.svelte";
    import RelatedMusicListView from "../component/RelatedMusicListView.svelte";
    import RelatedMusicCard from "../component/RelatedMusicCard.svelte";
    import MusicInfo from "../component/MusicInfo.svelte";
    import MusicTextInfo from "../component/MusicTextInfo.svelte";
    import GuestBook from "../component/GuestBook.svelte";

    onMount(async ()=> {
        await musicActions.init(); 
        await musicUI.loadReviews();
        musicUI.init(); 
        await musicUI.updateGlobalVisits();
    }); 

    $effect(()=>{
        if(musicUI.reviewTrigger > -1){
            musicUI.loadReviews();
        }
    });
</script>

<div class="app-layout">
    <div class="column left-list-column">
        <div class="nav-header">
            <a href="https://hani.chois.cloud" class="back-link">
                <span class="icon">&larr;</span> 
                <span class="text">문서 작업으로 돌아가기</span>
            </a>
        </div>

        {#if musicUI.isMobile}
            <div class="video-container-box">
                <MusicVideoPlayer />
            </div>
        {/if}

        <MusicListView>
            {#each musicUI.list as music (music.id)}
                <MusicCard item={music} />
            {/each}
        </MusicListView>
    </div>

    <div class="column center-content-column">
        {#if !musicUI.isMobile}
            <div class="video-container-box">
                <MusicVideoPlayer />
            </div>
        {/if}

        <RelatedMusicContainer>
            <RelatedMusicListView>
                {#each musicUI.relatedMusics as rm (rm.id)}
                    <RelatedMusicCard item={rm} />
                {/each}
            </RelatedMusicListView>
        </RelatedMusicContainer>

        <GuestBook />

        <div class="inline-info-area">
            <MusicInfo>
                <MusicTextInfo />
            </MusicInfo>
        </div>
    </div>

    <div class="column right-info-column">
        <MusicInfo>
            <MusicTextInfo />
        </MusicInfo>
    </div>    
</div>

<style>
    /* 1. 모바일 & 중간 화면 */
    .app-layout {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 20px;
        padding: 10px;
        box-sizing: border-box;
    }

    .video-container-box {
        width: 100%;
        max-width: 100%;
        background: #000;
        border-radius: 12px;
        overflow: hidden;
        aspect-ratio: 16 / 9;
        margin-bottom: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* 가사 영역 제어 */
    .right-info-column { display: none; } /* 맨 우측 칼럼은 숨김 */
    .inline-info-area { display: block; margin-top: 20px; } /* 중앙 칼럼 아래 가사 보임 */

    /* 2. 데스크톱 (768px 이상) */
    @media (min-width: 768px) { 
        .app-layout {
            display: grid;
            grid-template-columns: 400px 1fr; 
            max-width: 1200px;
            margin: 0 auto;
            gap: 30px;
            padding: 20px;
        }

        .left-list-column {
            position: sticky;
            top: 20px;
        }
    }

    /* 3. 울트라 와이드 (1600px 이상) */
    @media (min-width: 1600px) {
        .app-layout {
            grid-template-columns: 400px 1fr 350px;
            max-width: 100%;
        }

        /* 💻 와이드에서는 중앙 칼럼 안의 가사를 숨기고, 전용 우측 칼럼을 보여줌 */
        .inline-info-area { display: none; } 
        .right-info-column { 
            display: block; 
            position: sticky;
            top: 20px;
        }
    }

    /* 네비게이션 스타일 */
    .back-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
        color: #6b7280;
        padding: 6px 12px;
        border-radius: 20px;
        background: #f3f4f6;
        margin-bottom: 10px;
    }
</style>