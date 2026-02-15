<script>
    import { onMount, onDestroy } from 'svelte';
    import { musicUI } from "../store/musicUI.svelte";

    let player = null;
    let playerContainer = $state(null); // 반응성 추가
    let playerReady = $state(false);
    let apiReady = $state(false);

    const DEFAULT_URL = 'https://www.youtube.com/watch?v=3w5iMGSHvsE';

    /* =========================
       YouTube API 로딩 (더 견고하게)
    ========================= */
    onMount(() => {
        // 이미 API가 로드되어 있다면 바로 준비 완료
        if (window.YT && window.YT.Player) {
            apiReady = true;
        } else {
            if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
                const tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                document.body.appendChild(tag);
            }
            window.onYouTubeIframeAPIReady = () => {
                apiReady = true;
            };
        }
    });

    onDestroy(() => {
        if (player?.destroy) player.destroy();
    });

    /* =========================
       Player 생성 및 감시
    ========================= */
    function tryInitPlayer() {
        if (!apiReady || !playerContainer || player) return;

        const src = musicUI.currentMusic?.src ?? DEFAULT_URL;
        const videoId = extractVideoId(src);

        player = new window.YT.Player(playerContainer, {
            width: '100%',
            height: '100%',
            videoId,
            playerVars: {
                autoplay: 0,
                mute: 1,
                controls: 1,
                playsinline: 1,
                // origin 설정은 배포 환경에서 필수
                origin: window.location.origin 
            },
            events: {
                onReady: () => { playerReady = true; },
                onStateChange: (e) => { if (e.data === 0) musicUI.playNext(); }
            }
        });
    }

    // API나 컨테이너가 준비되면 즉시 실행
    $effect(() => {
        if (apiReady && playerContainer) {
            tryInitPlayer();
        }
    });

    // 곡이 바뀌면 대응
    $effect(() => {
        if (!playerReady || !musicUI.currentMusic) return;
        
        const videoId = extractVideoId(musicUI.currentMusic.src);
        try {
            // cue만 할지 로드할지 결정
            if (musicUI.isPlaying) {
                player.loadVideoById(videoId);
            } else {
                player.cueVideoById(videoId);
            }
        } catch (e) {
            console.error("재생 엔진 오류:", e);
        }
    });

    function extractVideoId(url) {
        if (!url) return '';
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n]+)/);
        return match ? match[1] : url;
    }
</script>

<div class="video-container">
    <div class="iframe-wrapper" class:hidden={!musicUI.currentMusic}>
        <div class="player" bind:this={playerContainer}></div>
    </div>
    
    {#if !musicUI.currentMusic}
        <div class="placeholder">
            재생할 곡을 선택해주세요.
        </div>
    {/if}
</div>

<style>
    .video-container {
        width: 100%;
        background: #000;
        border-radius: 12px;
        overflow: hidden;
        margin-bottom: 20px;
    }
    .iframe-wrapper {
        aspect-ratio: 16 / 9;
        width: 100%;
        background: black;
        }

        .player {
        width: 100%;
        height: 100%;
        }
    

    .iframe-wrapper :global(iframe) {
        width: 100%;
        height: 100%;
    }

    .placeholder {
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        background: #f5f5f5;
    }
</style>
