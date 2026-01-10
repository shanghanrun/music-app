<script>
    import { musicUI } from "../store/musicUI.svelte";
    let { children } = $props();
</script>

{#if musicUI.currentMusic}
    <div class="main-info">
        <h2>
            <span>{musicUI.currentMusic.title}</span>
            <span class="singer-name"> : {musicUI.currentMusic.singer}</span>
        </h2>
        <div class="tags">
            <span>#{musicUI.currentMusic.genre}</span>
            <span>#{musicUI.currentMusic.theme}</span>
        </div>

        {@render children?.()}
    </div>
{/if}

<style>
    .main-info { padding: 20px; overflow-y: auto; }
    .singer-name { font-weight: normal; color: #666; font-size: 1.2rem; }
    .tags { margin: 10px 0; color: #4caf50; font-weight: 600; font-size: 0.9rem; display: flex; gap: 8px; }
</style>