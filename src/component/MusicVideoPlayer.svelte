<script>
    import { onMount, onDestroy } from 'svelte';
    import { musicUI } from "../store/musicUI.svelte";

    /* =========================
       외부 객체 (반응성 ❌)
    ========================= */
    let player = null;
    let playerContainer = null;
    let playerReady = false;
    let apiReady = false;

    const DEFAULT_URL =
        'https://www.youtube.com/watch?v=3w5iMGSHvsE';

    /* =========================
       YouTube API 로딩
    ========================= */
    onMount(() => {
        if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
        }

        window.onYouTubeIframeAPIReady = () => {
            apiReady = true;
            tryInitPlayer();
        };
    });

    onDestroy(() => {
        if (player && typeof player.destroy === 'function') {
            player.destroy();
            player = null;
        }
    });

    /* =========================
       Player 생성
    ========================= */
    function tryInitPlayer() {
        if (!apiReady) return;
        if (!playerContainer) return;
        if (player) return; // 중복 생성 방지

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
                origin: window.location.origin
            },
            events: {
                onReady: () => {
                    playerReady = true;
                },
                onStateChange: onPlayerStateChange
            }
        });
    }

    /* =========================
       상태 변화 감지
    ========================= */
    $effect(() => {
        // DOM, API, 데이터 순서 무관하게 대응
        tryInitPlayer();
    });

    $effect(() => {
        if (!playerReady) return;
        if (!musicUI.currentMusic) return;

        const videoId = extractVideoId(musicUI.currentMusic.src);

        try {
            if (musicUI.isPlaying) {
                player.loadVideoById(videoId);
            } else {
                player.cueVideoById(videoId);
            }
        } catch (e) {
            console.error("재생 엔진 오류:", e);
        }
    });

    /* =========================
       플레이어 이벤트
    ========================= */
    function onPlayerStateChange(event) {
        // 0 = 종료
        if (event.data === 0) {
            musicUI.playNext();
        }
    }

    /* =========================
       Utils
    ========================= */
    function extractVideoId(url) {
        if (!url) return '';
        if (url.includes('v=')) return url.split('v=')[1].split('&')[0];
        if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split('?')[0];
        return url;
    }
</script>

<!-- =========================
     UI
========================= -->
<div class="video-container">
    {#if musicUI.currentMusic}
        <div class="iframe-wrapper">
            <div class="player" bind:this={playerContainer}></div>
        </div>
    {:else}
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
