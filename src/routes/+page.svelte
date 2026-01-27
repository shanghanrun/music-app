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
        <div class="nav-header">
            <a href="https://hani.chois.cloud" class="back-link">
                <span class="icon">&larr;</span> 
                <span class="text">문서 작업으로 돌아가기</span>
            </a>
        </div>
        <!-- <a href="https://hani.chois.cloud" class="doc"> 문서작업으로 돌아가기 </a> -->
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

    .back-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
        color: #6b7280; /* 너무 튀지 않는 차분한 회색 */
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.2s ease;
        padding: 6px 12px;
        border-radius: 20px; /* 알약 모양 */
        background: #f3f4f6; /* 연한 배경색 */
    }

    .back-link:hover {
        color: #3b82f6; /* 호버 시 파란색으로 포인트 */
        background: #eff6ff;
        transform: translateX(-4px); /* 왼쪽으로 살짝 움직이는 애니메이션 */
    }

    .back-link .icon {
        font-size: 1.1rem;
        font-weight: bold;
    }
    .doc{
        margin-left: 233px;
        background: rgb(118, 255, 6);
        margin-bottom: 5px;
        padding: 3px;
    }
    .movie-column{
        margin-top: 40px;
    }
    /* 1. 기본 레이아웃 (모바일 우선 - Mobile First) */
    .app-layout {
        display: flex;
        flex-direction: column; /* 모바일에선 위아래로 배치 */
        width: 100%;
        max-width: 100vw; /* 브라우저 폭을 넘지 않게 고정 */
        margin: 0 auto;
        padding: 2px; /* 모바일 좌우 여백 */
        box-sizing: border-box; /* 패딩이 폭에 포함되도록 */
        gap: 20px;
    }
    /* 2. 데스크톱 대응 (화면 폭이 768px 이상일 때) */
    @media (min-width: 768px) { 
        .app-layout {
            display: grid;
            /* 왼쪽 리스트(고정 400px) / 오른쪽 메인(나머지 1fr) */
            grid-template-columns: 400px 1fr; 
            align-items: start;
            max-width: 1200px; /* 데스크톱에선 너무 퍼지지 않게 제한 */
            padding: 2px;
        }

        .movie-column {
            position: sticky;
            top: 20px;
            width: 100%;
        }
    }

    /* 3. 울트라 와이드 대응 (화면 폭이 1600px 이상일 때) */
    @media (min-width: 1600px) {
        .app-layout {
            /* 3단 구성: 리스트(400px) / 메인(1fr) / 정보창(350px) */
            grid-template-columns: 400px 1fr 350px;
            max-width: 100%; /* 와이드 화면에선 넓게 사용 */
        }
    }

    .nav-header {
        padding: 5px 0; /* 모바일 폭 확보를 위해 패딩 축소 */
        width: 100%;
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