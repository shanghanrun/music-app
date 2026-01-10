<script>
    import { musicUI } from "../store/musicUI.svelte";
    let { children } = $props();
</script>

<div class="recommend-section">
    {#if musicUI.currentMusic}
        <h4>Similar Theme: <span class="theme-name">{musicUI.currentMusic.theme}</span></h4>
        <div class="recommend-grid">
            {@render children?.()}
        </div>
    {/if}
</div>

<style>
    .recommend-section { margin-top: 24px; border-top: 1px solid #eee; padding-top: 20px; }
    .recommend-section h4 { font-size: 1rem; color: #333; margin-bottom: 12px; }
    .theme-name { color: #4caf50; }
    .recommend-grid { 
        display: grid; 
        grid-template-columns: repeat(3, 1fr); 
        gap: 15px; 
    }
</style>