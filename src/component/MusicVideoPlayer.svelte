<script>
    import { musicUI } from "../store/musicUI.svelte";

</script>

<div class="video-container">
    {#if musicUI.currentMusic}
        <div class="iframe-wrapper">
            <iframe
                src={musicUI.videoUrl + (musicUI.isPlaying ? "?autoplay=1" : "")}
                title={musicUI.currentMusic.title}
                frameborder="0"
                allow="autoplay; encrypted-media"
                allowfullscreen
            ></iframe>
        </div>
        <!-- <div class="current-info">
            <h4>{musicUI.currentMusic.title}</h4>
            <p>{musicUI.currentMusic.singer}</p>
        </div> -->
    {:else}
        <div class="placeholder">재생할 곡을 선택해주세요.</div>
    {/if}
</div>

<style>
    .video-container { width: 100%; background: #000; border-radius: 12px; overflow: hidden; }
    .iframe-wrapper { position: relative; padding-top: 56.25%; /* 16:9 비율 */ }
    iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
    .current-info { padding: 15px; background: #fff; border-top: 1px solid #eee; }
    .placeholder { height: 300px; display: flex; align-items: center; justify-content: center; color: #666; background: #f5f5f5; }
</style>