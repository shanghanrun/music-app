<script>
	import { musicUI } from '../store/musicUI.svelte';

</script>

<div class="scroll-content">
    <div class="info-section">
        <label>Original</label>
        <pre>{musicUI.currentMusic.lyric || '가사 없음'}</pre>
    </div>

    <div class="info-section">
        <label>Translation</label>
        <pre>{musicUI.currentMusic.koLyric || '번역 없음'}</pre>
    </div>

    {#if musicUI.currentMusic.etc}
        <div class="info-section etc-section">
            <label>Information</label>
            <div class="etc-content">
				{@html musicUI.currentMusic.etc}</div> 
            </div>
    {/if}
</div>

<style>
    .scroll-content {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    .info-section label {
        display: block;
        font-weight: bold;
        color: #666;
        font-size: 0.85rem;
        margin-bottom: 8px;
        text-transform: uppercase;
        border-left: 3px solid #ddd;
        padding-left: 8px;
    }
    pre {
        white-space: pre-wrap;
        word-break: break-word;
        font-family: inherit;
        font-size: 0.95rem;
        line-height: 1.6;
        background: #f9f9f9;
        padding: 12px;
        border-radius: 8px;
        margin: 0;
    }
    .etc-content {
        font-size: 0.9rem;
        color: #444;
        line-height: 1.5;
        padding: 10px;
        background: #fffbe6; /* 메모 느낌의 연한 노란색 */
        border-radius: 8px;
    }
</style>