<script>
import { musicFormUI } from "../store/musicFormUI.svelte";

</script>


<section class="col">
	<header>
		<h3>{musicFormUI.editMode ? "데이터 수정" : "새 데이터 추가"}</h3>
	</header>
	<div class="input-form">
		<div class="input-group">
			<label>제목</label>
			<input type="text" bind:value={musicFormUI.form.title} placeholder="제목" />
		</div>
		<div class="input-group">
			<label>가수</label>
			<input type="text" bind:value={musicFormUI.form.singer} placeholder="가수" />
		</div>
		<div class="input-row">
			<div class="input-group">
				<label>장르</label>
				<input type="text" bind:value={musicFormUI.form.genre} placeholder="장르" />
			</div>
			<div class="input-group">
				<label>테마</label>
				<input type="text" bind:value={musicFormUI.form.theme} placeholder="테마" />
			</div>
		</div>
		<div class="input-group">
			<label>유튜브 URL</label>
			<input type="text" bind:value={musicFormUI.form.src} placeholder="유튜브 URL" />
				<!-- oninput={()=> form.thumbUrl = getThumbUrl(form.src)} -->
			
		</div>
		<div>
			<label>유투브 썸네일 URL</label>
			<input type="text" bind:value={musicFormUI.form.thumbUrl} placeholder="유투브 썸네일 URL">
		</div>
		<div class="input-group">
			<label>원본 가사</label>
			<textarea bind:value={musicFormUI.form.lyric}></textarea>
		</div>
		<div class="input-group">
			<label>번역 가사</label>
			<textarea bind:value={musicFormUI.form.koLyric}></textarea>
		</div>
		<div class="input-group image-file">
			<label>이미지</label>
			<input type="file" onchange={(e) => musicFormUI.form.image = e.target.files[0]} />
		</div>
		<div class="input-group">
			<label>비고 (etc)</label>
			<textarea bind:value={musicFormUI.form.etc} placeholder="추가 메모나 특징을 입력하세요"></textarea>
		</div>
		<div class="form-btns">
			<button class="save-btn" onclick={musicFormUI.handleSave}>저장</button>
			<button class="cancel-btn" onclick={musicFormUI.resetForm}>취소</button>
		</div>
	</div>
</section>


<style>
    /* 섹션 공통 스타일 */
    section.col {
        background: white;
        padding: 24px;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        overflow-y: auto; /* 내용이 길어지면 스크롤 생성 */
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        height: 100%;
        box-sizing: border-box;
    }

    header h3 {
        margin: 0 0 20px 0;
        font-size: 1.25rem;
        font-weight: 700;
        color: #1a1a1a;
        border-left: 4px solid #3b82f6; /* 제목 왼쪽 강조선 */
        padding-left: 12px;
    }

    .input-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    /* 장르, 테마를 나란히 배치하는 행 */
    .input-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }

    label {
        font-size: 0.85rem;
        font-weight: 600;
        color: #4b5563;
    }

    input[type="text"],
    textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 0.9rem;
        transition: all 0.2s;
        box-sizing: border-box;
    }

    input[type="text"]:focus,
    textarea:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    textarea {
        resize: vertical;
        min-height: 80px;
    }

    /* 파일 입력 스타일 */
    input[type="file"] {
        font-size: 0.85rem;
        color: #6b7280;
    }
	.image-file{
		border: 1px solid #d1d5db; /* 회색 테두리 */
	}

    /* 버튼 그룹 */
    .form-btns {
        display: grid;
        grid-template-columns: 2fr 1fr; /* 저장 버튼을 더 크게 */
        gap: 10px;
        margin-top: 10px;
        padding-bottom: 20px;
    }

    button {
        padding: 12px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s;
        border: none;
    }

    .save-btn {
        background-color: #3b82f6;
        color: white;
    }

    .cancel-btn {
        background-color: #e5e7eb;
        color: #374151;
    }

    button:hover {
        opacity: 0.9;
    }

    /* 스크롤바 디자인 (세련되게) */
    section.col::-webkit-scrollbar {
        width: 6px;
    }
    section.col::-webkit-scrollbar-thumb {
        background-color: #d1d5db;
        border-radius: 10px;
    }
</style>