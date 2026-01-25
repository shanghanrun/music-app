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


	// 1. 페이지가 열리면 서버에서 데이터를 싹 긁어와서 musicState.allMusics를 채웁니다.
	onMount(async ()=> {
		await musicActions.init(); // 데이터 먼저 로드
        await musicUI.loadReviews()
		musicUI.init(); // UI 초기화. 현재 곡 등

	}) 

    $effect(()=>{
        // if(musicUI.reviews.length > 0){
        //     musicUI.loadReviews()
        // }
        if(musicUI.reviewTrigger> -1){
            musicUI.loadReviews()
        }
    })
</script>

<div class="app-layout">
    <div class="column list-column">
        <a href="https://hani.chois.cloud" class="doc"> 문서작업으로 돌아가기 </a>
        <MusicListView>
            {#if musicUI.isMobile}
                <div class="mobile-player-area">
                    <MusicVideoPlayer />
                </div>
            {/if}
            
            {#each musicUI.list as music (music.id)}
                <MusicCard item={music} />
            {/each}
        </MusicListView>
    </div>

    <div class="column movie-column">
        {#if !musicUI.isMobile}
            <div class="desktop-player-area">
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
    </div>
    <div class="column info-column">
        <MusicInfo>
            <MusicTextInfo />
        </MusicInfo>
    </div>    
</div>

<style>
    .doc{
        margin-left: 233px;
        background: rgb(118, 255, 6);
        margin-bottom: 5px;
        padding: 3px;
    }
    .movie-column{
        margin-top: 40px;
    }
     /* 기본: 모바일 우선 (1열) */
    .app-layout {
        display: grid;
        grid-template-columns: 1fr; /* 모바일은 1열 고정 */
        gap: 20px;
        max-width: 1400px;
        margin: 0 auto;
        padding: 10px;
    }

    /* 화면이 커졌을 때 (데스크톱 - 2칼럼) */
    /* 테스트를 위해 1024px 대신 768px로 낮춰서 확인해보세요 */
    @media (min-width: 1024px) { 
        .app-layout {
            /* !important는 최후의 수단이지만, 테스트용으로 넣어보세요 */
            grid-template-columns: 400px 1fr !important; 
            display: grid !important;
            align-items: start;
        }

        .list-column {
            min-width: 300px;
        }

        .movie-column {
            position: sticky;
            top: 20px;
            width: 100%;
        }
    }

    /* 나중에 3칼럼 확장 시 */
    @media (min-width: 1600px) {
        .app-layout {
            /* 왼쪽(450px) / 중앙(1fr) / 오른쪽(가사 등 350px) */
            grid-template-columns: 400px 1fr 350px; 
        }
    }

    .mobile-player-area {
        position: sticky;
        top: 0;
        z-index: 10;
        background: white;
        margin-bottom: 15px;
    }

    .desktop-player-area {
        margin-bottom: 20px;
        border-radius: 12px;
        overflow: hidden;
        background: #000;
        aspect-ratio: 16 / 9;
    }
</style>