<script>
import { musicState, musicActions } from '$lib/pb.svelte.js';
import { onMount } from 'svelte';
import BatchForm from '../../component/BatchForm.svelte';
import { getThumbUrl } from '$lib/youtubeUtil';
import { goto } from '$app/navigation';
  import EditableListView from '../../component/EditableListView.svelte';
  import EditableCard from '../../component/EditableCard.svelte';

    // --- 상태 관리 ---
    let editMode = $state(false); // 현재 수정 중인지 여부
    let selectedIds = $state(new Set()); // 일괄 삭제용 체크박스 상태
    // let searchTerm = $state('') // 검색어
    // let sortOrder = $state('asc')
    let hasChecked = $derived(selectedIds.size >0)
    
    // 중앙 입력 폼 데이터 상태
    let form = $state({
        id: null,
        title: '', genre: '', theme: '', src: '',
        lyric: '', koLyric: '', etc: '', image: null, thumbUrl:''
    });

    // --- 로직 ---
    onMount(() => musicActions.init()); // 데이터 불러오기

    // 검색란 필터링 적용
    // let filteredList = $derived(
    //     musicState.allMusics.filter(m => 
    //         m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         m.genre.toLowerCase().includes(searchTerm.toLowerCase())
    //     )
    // );

    // 우측 칼럼용 통계: 조회수 상위 5개 계산
    let topViewed = $derived(
        [...musicState.allMusics]
            .sort((a, b) => (b.viewed || 0) - (a.viewed || 0))
            .slice(0, 5)
    );

    // 수정 버튼 클릭 시 호출
    function startEdit(music) {
        editMode = true;
        if (!music.thumbUrl){
            music.thumbUrl = getThumbUrl(music.src)
        }
        form = { ...music, image: null }; // 이미지는 새로 올릴 때만 처리하도록 초기화
    }

    // 초기화/새로고침 함수
    function resetForm() {
        editMode = false;
        form = { id: null, title: '', genre: '', theme: '', src: '', lyric: '', koLyric: '', etc: '', image: null, thumbUrl:'' };
    }

    // 저장(등록/수정) 처리
    async function handleSave() {
		// 작업 전 비밀번호 확인
		if (!verifyAdmin()) return;

        const formData = new FormData();
       
        Object.keys(form).forEach(key => {
            if (key === 'image') {
                // 실제 '파일' 객체일 때만 FormData에 추가
                if (form[key] instanceof File) {
                    formData.append(key, form[key]);
                }
                // null인 경우는 append하지 않음 -> 서버는 기존 이미지 유지로 판단
            } else if (form[key] !== null) {
                formData.append(key, form[key]);
            }
        });

        if (editMode) {
            await musicActions.updateMusic(form.id, formData);
        } else {
            await musicActions.createMusic(formData);
        }
        resetForm();
    }

    // 일괄 삭제
    async function deleteSelected() {
        if (selectedIds.size === 0) return;

		// 작업 전 비밀번호 확인
		if (!verifyAdmin()) return;

        if (confirm(`${selectedIds.size}개의 항목을 삭제하시겠습니까?`)) {
            for (let id of selectedIds) {
                await musicActions.deleteMusic(id);
            }
            // 삭제 후 Set을 완전히 비우고 새 객체로 교체하여 반응성 보장
            selectedIds = new Set();
        }
    }

    // 체크박스 변경 핸들러 (반응성을 위해 Set 재할당)
    function toggleSelected(id, checked) {
        if (checked) {
            selectedIds.add(id);
        } else {
            selectedIds.delete(id);
        }
        // Svelte 5에서 Set 내부 변경을 확실히 알리기 위해 재할당
        selectedIds = new Set(selectedIds);
    }

	

    

</script>

<div class="admin-container">
    <section class="col">
        <EditableListView 
			title="음악 목록" 
			originalList={musicState.allMusics} 
			onDelete={deleteSelected}	
			hasChecked={hasChecked}
		>
				{#snippet children(item)}
					<EditableCard 
						item={item} 
                		onToggle={toggleSelected}
						onEdit={startEdit}
						onDelete={deleteSelected}
					/>
				{/snippet}
		</EditableListView>
    </section>

    <section class="col">
        <header>
            <h3>{editMode ? "데이터 수정" : "새 데이터 추가"}</h3>
        </header>
        <div class="input-form">
            <div class="input-group">
                <label>제목</label>
                <input type="text" bind:value={form.title} placeholder="제목" />
            </div>
            <div class="input-group">
                <label>가수</label>
                <input type="text" bind:value={form.singer} placeholder="가수" />
            </div>
            <div class="input-row">
                <div class="input-group">
                    <label>장르</label>
                    <input type="text" bind:value={form.genre} placeholder="장르" />
                </div>
                <div class="input-group">
                    <label>테마</label>
                    <input type="text" bind:value={form.theme} placeholder="테마" />
                </div>
            </div>
            <div class="input-group">
                <label>유튜브 URL</label>
                <input type="text" bind:value={form.src} placeholder="유튜브 URL" />
                    <!-- oninput={()=> form.thumbUrl = getThumbUrl(form.src)} -->
               
            </div>
            <div>
                <label>유투브 썸네일 URL</label>
                <input type="text" bind:value={form.thumbUrl} placeholder="유투브 썸네일 URL">
            </div>
            <div class="input-group">
                <label>원본 가사</label>
                <textarea bind:value={form.lyric}></textarea>
            </div>
            <div class="input-group">
                <label>번역 가사</label>
                <textarea bind:value={form.koLyric}></textarea>
            </div>
            <div class="input-group">
                <label>이미지</label>
                <input type="file" onchange={(e) => form.image = e.target.files[0]} />
            </div>
            <div class="input-group">
                <label>비고 (etc)</label>
                <textarea bind:value={form.etc} placeholder="추가 메모나 특징을 입력하세요"></textarea>
            </div>
            <div class="form-btns">
                <button class="save-btn" onclick={handleSave}>저장</button>
                <button class="cancel-btn" onclick={resetForm}>취소</button>
            </div>
        </div>
    </section>

    <section class="col">
        <section class="popular-section">
            <header>
                <h3>인기 TOP 5</h3>
                <button class="refresh-btn" onclick={() => musicActions.init()}>업데이트</button>
                <button class="home-btn" onclick={() => goto('/')}>Home</button>
            </header>
            <ul class="top-list">
                {#each topViewed as music, i}
                    <li>
                        <span class="rank">{i + 1}</span>
                        <span class="name">{music.title} : {music.singer}</span>
                        <span class="count">{music.viewed || 0} views</span>
                    </li>
                {/each}
            </ul>
        </section>

        <BatchForm />
    </section>
</div>

<style>
    /* 1:1:1 비율 유지 */
    .admin-container { 
        display: grid; 
        grid-template-columns: 1fr 1fr 1fr; 
        gap: 20px; padding: 20px; height: 100vh; 
        background: #f0f2f5; box-sizing: border-box;
    }

    section.col { 
        background: white; padding: 24px; border-radius: 12px; 
        display: flex; flex-direction: column; overflow: hidden; 
        box-shadow: 0 4px 6px rgba(0,0,0,0.05); 
    }

    header { 
        flex-shrink: 0; margin-bottom: 20px; border-bottom: 2px solid #f0f2f5; padding-bottom: 12px;
    }
    header h3 { margin: 0; font-size: 1.2rem; color: #1f1f1f; display: flex; align-items: center; }

    /* 목록 헤더 검색란 및 버튼 */
    .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 10px; }
    .search-bar { flex: 1; padding: 6px 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 0.85rem; }
    .header-bottom { display: flex; justify-content: flex-end; gap: 8px; }

    /* 카드 스타일 (기존 성공 코드 기반 복구) */
    .card-container { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
    .music-card {
        display: flex; align-items: center; background: #fafafa; padding: 12px;
        border-radius: 12px; border: 1px solid #f0f0f0; gap: 12px;
    }
    .music-card.selected { background: #e6f7ff; border-color: #91d5ff; }
    .card-left { 
        display: flex; align-items: center; gap: 12px; /* 1번: 수직 중앙 정렬 핵심 */
    }

    /* 이미지 크기 강제 고정 (망가짐 방지) */
    .img-wrapper {
        width: 60px; height: 60px; min-width: 60px; 
        overflow: hidden; border-radius: 8px; background: #eee;
    }
    .img-wrapper img { width: 100%; height: 100%; object-fit: cover; }

    .large-checkbox { width: 20px; height: 20px; cursor: pointer; }
    .card-body { flex: 1; overflow: hidden; }
    .card-body .title { font-weight: 600; font-size: 1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .card-body .meta { font-size: 0.85rem; color: #8c8c8c; }
    
    .card-actions { display: flex; gap: 6px; }
    .icon-btn { border: 1px solid #eee; background: white; width: 34px; height: 34px; border-radius: 8px; cursor: pointer; }

    /* 폼 및 기타 공통 스타일 */
    .input-form { display: flex; flex-direction: column; gap: 14px; overflow-y: auto; }
    .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .input-group { display: flex; flex-direction: column; gap: 4px; }
    .input-group label { font-size: 0.85rem; font-weight: 600; color: #555; }
    input, textarea { padding: 10px; border: 1px solid #d9d9d9; border-radius: 6px; }
    textarea { height: 70px; resize: none; }

    .form-btns { display: flex; gap: 10px; margin-top: 10px; }
    .save-btn { flex: 2; background: #1890ff; color: white; border: none; padding: 12px; border-radius: 6px; font-weight: 600; cursor: pointer; }
    .cancel-btn { flex: 1; background: #f5f5f5; border: 1px solid #d9d9d9; border-radius: 6px; cursor: pointer; }

    .count-badge { background: #1890ff; color: white; padding: 2px 8px; border-radius: 20px; font-size: 0.8rem; margin-left: 6px; }
    /* 정렬 버튼: 진한 녹색 배경 + 흰색 글자 */
    .sort-btn { 
        background: #43a047; 
        border: 1px solid #1b5e20; 
        color: white; 
        padding: 6px 14px; 
        border-radius: 6px; 
        cursor: pointer; 
        font-size: 0.85rem; 
        font-weight: 500;
        transition: background 0.2s ease;
    }

    .sort-btn:hover { 
        background: #1b5e20; /* 호버 시 더 진한 녹색 */
    }
    .danger-btn { 
        background: #ff4d4f; color: white; border: none; 
        padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; transition: 0.3s;
    }
    /* 비활성화 상태: 흐린 색상과 클릭 금지 커서 */
    .danger-btn:disabled, .danger-btn.disabled { 
        background: #ffa39e !important; /* 흐린 빨강 */
        opacity: 0.6;
        cursor: not-allowed;
        filter: grayscale(0.5); /* 약간 회색톤 추가 */
    }
    .top-list li { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f2f5; }
    .rank { font-weight: bold; color: #ff4d4f; }
</style>