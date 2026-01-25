import { getThumbUrl } from '$lib/youtubeUtil';
import { musicActions } from "$lib/pb.svelte"

class MusicFormUI{
    selectedIds = $state(new Set())
	editMode = $state(false)
	form = $state({
		id: null,
		title: '', 
        singer:'',
        genre: '', theme: '', src: '',
        lyric: '', koLyric: '', etc: '', image: null, thumbUrl:''
	})

    //2. 체크박스 몇개를 선택했는지 상태 확인 로직
	get selectedCount(){ return this.selectedIds.size}
	get hasChecked() {return this.selectedIds.size > 0} 

	isChecked=(id)=> { return this.selectedIds.has(id)} // 특정 항목이 체크되었는지 id로 확인

	toggleCheck=(id)=>{ // 해당 id에 대해 체크상태를 반전하기
		if (this.selectedIds.has(id)) this.selectedIds.delete(id)
		else this.selectedIds.add(id)
		this.selectedIds = new Set(this.selectedIds) // 새롭게 Set을 할당해서 반응성유도
	}
    // 4. 삭제 통합 로직 (단일/다중 모두 처리)
        deleteSelected=async(targetId = null)=> { 
            // 인자를 넣지 않을 경우에는, selectedIds를 참조해서 일괄 삭제.
            // 인자로 단일 id를 넣을 경우에는 해당 id만 삭제
            const ids = targetId ? [targetId] : Array.from(this.selectedIds);
            //selectedIds는 Set자료라서 Array로 변환한 것
    
            if (ids.length === 0) return;
    
            if (confirm(`${ids.length}개의 항목을 삭제하시겠습니까?`)) {
                
                await musicActions.deleteMultiple(ids);
                
                // selectedIds 상태 정리: 삭제된 id들 Set에서 제거
                ids.forEach(id => this.selectedIds.delete(id))
                this.selectedIds = new Set(this.selectedIds);// svelte5에 반응성 전파
            }
        }
        cancelSelected(){
            this.selectedIds = new Set()
        }
    

	handleEdit=(music)=>{
		this.editMode = true;
		if(!music.thumbUrl){
			music.thumbUrl = getThumbUrl(music.src)
		} // 유투브 동영상주소로 자동으로 썸네일데이터 넣어주기
		this.form ={ ...music, image: null}
		//이미지는 새로 올릴 때만 처리하도록 초기화 
	}

	// 초기화(입력난 비우기) 및 새로고침 함수
	resetForm=()=>{
		this.editMode = false;
		this.form = { id: null, title: '',
            singer:'', genre: '', theme: '', src: '', lyric: '', koLyric: '', etc: '', image: null, thumbUrl:'' }
	}

	// 저장(등록/수정) 처리
    handleSave=()=> {
        const formData = new FormData();
       
        Object.keys(this.form).forEach(key => {
            if (key === 'image') {
                // 실제 '파일' 객체일 때만 FormData에 추가
                if (this.form[key] instanceof File) {
                    formData.append(key, this.form[key]);
                }
                // null인 경우는 append하지 않음 -> 서버는 기존 이미지 유지로 판단
            } else if (this.form[key] !== null) {
                formData.append(key, this.form[key]);
            }
        });

        // 제대로 된 데이터가 안 들어왔을 경우 취소
        if (!formData.title || !formData.singer) {
            console.log('저장에러..')
            console.log('formData: ', formData)
            return
        }

        if (this.editMode) { // editMode일 경우는 update함수 실행(입력난만 교체)
            musicActions.updateMusic(this.form.id, formData);
        } else { // editMode가 아닌, 직접 입력시
            musicActions.createMusic(formData);
        }
        this.resetForm();
    }

}

export const musicFormUI = new MusicFormUI();