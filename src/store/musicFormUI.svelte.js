import { getThumbUrl } from '$lib/youtubeUtil';

class MusicFormUI{
	editMode = $state(false)
	form = $state({
		id: null,
		title: '', genre: '', theme: '', src: '',
        lyric: '', koLyric: '', etc: '', image: null, thumbUrl:''
	})

	handleEdit(music){
		editMode = true;
		if(!music.thumbUrl){
			music.thumbUrl = getThumbUrl(music.src)
		} // 유투브 동영상주소로 자동으로 썸네일데이터 넣어주기
		this.form ={ ...music, image: null}
		//이미지는 새로 올릴 때만 처리하도록 초기화 
	}

	// 초기화(입력난 비우기) 및 새로고침 함수
	resetForm(){
		editMode = false;
		this.form = { id: null, title: '', genre: '', theme: '', src: '', lyric: '', koLyric: '', etc: '', image: null, thumbUrl:'' }
	}

	// 저장(등록/수정) 처리
    handleSave() {
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

        if (editMode) { // editMode일 경우는 update함수 실행(입력난만 교체)
            musicActions.updateMusic(this.form.id, formData);
        } else { // editMode가 아닌, 직접 입력시
            musicActions.createMusic(formData);
        }
        resetForm();
    }

}

export const musicFormUI = new MusicFormUI();