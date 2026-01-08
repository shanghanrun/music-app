<script>
    import { musicStore } from '$lib/store.svelte.js';
    let rawInput = $state(''); // 텍스트 영역 바인딩
</script>

<div class="batch-wrapper">
  <div class="input-group">
    <label for="batch-text">데이터 일괄 추가</label>
    <div class="textarea-container">
      <textarea 
        id="batch-text"
        bind:value={rawInput} 
        placeholder="제목&#10;가수&#10;장르&#10;테마&#10;URL&#10;; (곡 구분자)"
      ></textarea>
      <div class="right-margin-space"></div>
    </div>
  </div>
  
  <button class="primary-btn" onclick={() => musicStore.batchInsert(rawInput)}>
    일괄입력 실행
  </button>
</div>

<style>
  .batch-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem;
    background: #fff;
    border-radius: 8px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* 텍스트 영역과 우측 마진 공간을 감싸는 컨테이너 */
  .textarea-container {
    display: flex; /* 가로로 배치하여 우측 공간 확보 */
    width: 100%;
  }

  textarea {
    flex: 1; /* 남은 공간을 모두 차지 */
    height: 300px; /* 좌측 폼과 밸런스를 맞추기 위해 높이 상향 */
    padding: 15px;
    /* 중요: 우측 텍스트가 테두리에 너무 붙지 않도록 내부 여백 추가 */
    padding-right: 30px; 
    border: 2px solid #4caf50; 
    border-radius: 12px;
    font-size: 0.95rem;
    line-height: 1.6;
    resize: none;
    outline: none;
  }

  /* 이미지에서 표시하신 우측 초록색 세로 박스 영역 (마진 효과) */
  .right-margin-space {
    width: 5px; /* 이 수치를 조절하여 우측 여백 크기를 결정 */
    background: transparent;
  }

  .primary-btn {
    width: 100%;
    padding: 1.1rem;
    background-color: #4caf50; /* 버튼 배경색을 텍스트 테두리와 통일 */
    color: white; /* 글자색 흰색 */
    border: none;
    border-radius: 50px; 
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    /* 버튼이 너무 평면적이지 않게 살짝 그림자 추가 */
    box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);
    transition: all 0.2s ease;
  }

  .primary-btn:hover {
    background-color: #43a047;
    transform: translateY(-2px);
  }

  .primary-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(76, 175, 80, 0.3);
  }
</style>