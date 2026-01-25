<script>
	import { musicUI } from "../store/musicUI.svelte";
    // let { item } = $props();
</script>

<div class="guestbook-container">
	<h3>Reviews ({musicUI.reviews.length})</h3>
	<div class="review-list">
		{#each musicUI.reviews as review}
			<div class="review-card">
				<span class="review-content">{review.music}</span>
				<span class="review-date">{new Date(review.created).toLocaleDateString()}</span>
			</div>
		{:else}
			<p class="empty-msg">첫 감상평을 남겨주세요! 😊</p>
		{/each}
	</div>

	<div class="review-input-row">
		<input type="text" 
			placeholder="사이트 감상평을 적어주세요~"
			bind:value={musicUI.reviewText}
			onkeydown={(e) => e.key === 'Enter' && musicUI.saveReview()}
		/> 
		<button onclick={() => {
			musicUI.saveReview()}}>확인</button>
	</div>
</div>

<style>
	.guestbook-container {
        /* margin-top: 5px; */
        padding: 15px;
        background: #fdfdfd;
        border-radius: 12px;
        border: 1px dashed #ddd;
    }

    .review-list {
        max-height: 230px; /* 리뷰가 많아지면 스크롤 */
        overflow-y: auto;
        margin-bottom: 15px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .review-card {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap; /* 공간 부족시 다음줄로 넘어가게*/
        background: rgb(222, 240, 228);
        padding: 10px 14px;
        padding: 10px 14px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        border-left: 4px solid #4caf50;
    }

    .review-content { margin: 0 0 5px 0; font-size: 0.95rem; color: #333; line-height: 1.4; }
    .review-date { font-size: 0.75rem; color: #999; }

    .review-input-row {
        display: flex;
        gap: 8px;
    }

    .review-input-row input {
        flex: 1;
        padding: 12px;
        border-radius: 25px; /* 둥글게 해서 더 이쁘게 */
        border: 1px solid #eee;
        background: #d7e4dd;
        outline: none;
    }

    .review-input-row button {
        padding: 0 20px;
        background: #4caf50;
        color: white;
        border: none;
        border-radius: 25px;
        font-weight: bold;
        cursor: pointer;
    }

    .empty-msg { text-align: center; color: #ccc; font-size: 0.9rem; padding: 20px 0; }
</style>
