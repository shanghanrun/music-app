import { musicState, musicActions } from "$lib/pb.svelte"


class MusicUI{
	isMobile = $state(false)

	constructor(){
		//클라이언트 사이드인 경우에만 리스너등록
		if(typeof window !== "undefined") {
			this.checkMobile()
			window.addEventListener('resize', ()=>this.checkMobile())
		}
	}
	checkMobile(){
		this.isMobile = window.innerWidth < 768;
	}

	searchTerm = $state('')
	// selectedIds = $state(new Set())
	title ="음악 목록"
	sortKey = $state('title') // 사용자가 선택하는 값

	// 실제 정렬에 사용 중인 상태 
    currentSortKey = $state('title'); 
    sortOrder = $state('asc'); 

	// 노래선택, 재생관련 상태
	currentMusic = $state(null)
	isPlaying = $state(false)

	// 플레이리스트의 카드에서, 선택하면 버튼에 의해서 currentMusic에 등록되는데, 플레이버튼을 누르면 플레이가 되고, 다시 한번 누르면 멈추게 하려면, isCurrent 여부가 중요하다.
	isCurrent(id){
		return this.currentMusic?.id === id;
	}

	// 통계용: 조회수 상위 5개 계산
    get topViewed() {
        return [...musicState.allMusics]
            .sort((a, b) => (b.viewed || 0) - (a.viewed || 0))
            .slice(0, 5)
	}

	//1. 검색어 + 정렬이 통합된 리스트 (ListView에서 사용)
	get list(){
		// 먼저 검색어로 필터링  (검색어가 없을 경우는 전체 목록이 된다.)
		const term = this.searchTerm.toLowerCase()
		let filtered = musicState.allMusics.filter(m => (
			m.title.toLowerCase().includes(term) || m.singer.toLowerCase().includes(term)
		)) //제목, 가수



		filtered.sort((a, b) => {
			const valA = String(a[this.currentSortKey]); // 혹시 모를 숫자/null 대비 문자열화
			const valB = String(b[this.currentSortKey]);

			if (this.sortOrder === 'asc') {
				return valA.localeCompare(valB, undefined, { numeric: true });
			} else {
				// b와 a의 위치를 바꿔서 내림차순 구현
				return valB.localeCompare(valA, undefined, { numeric: true });
			}
		});
		//{ numeric: true } 옵션 덕분에 "트랙 10"이 "트랙 2"보다 뒤에 오는, 인간의 상식에 맞는 정렬을 수행합니다.

		// 2. [모바일 전용 로직] 모바일일 때만 선택된 곡을 최상단으로!
        if (this.isMobile && this.currentMusic) {
            const currentIndex = filtered.findIndex(m => m.id === this.currentMusic.id);
            if (currentIndex > -1) {
                const [selectedItem] = filtered.splice(currentIndex, 1);
                filtered.unshift(selectedItem);
            }
        } // 현재 item을 배열 맨 처음 아이템으로 이동
        return filtered;

	}

	// 정렬을 호출하는 함수. 
	applySort(){
		if (this.sortKey === this.currentSortKey){
			// 정렬기준을 변경하지 않은 상태에서 (sort버튼을 반복누를 경우)
			this.sortOrder = this.sortOrder === 'asc'? 'desc' : 'asc'
		} else{ // 정렬기준을 바꾸고서, sort버튼을 누를 경우 
			this.currentSortKey = this.sortKey;
			this.sortOrder = 'asc' // 새로운 키로 인한 정렬은 올림차순으로 정함
		}
	}

	//연관 곡 리스트 (현재 곡과 같은 테마, 6개 제한)
    get relatedMusics() {
        if (!this.currentMusic) return [];
        return musicState.allMusics
            .filter(m => m.theme === this.currentMusic.theme && m.id !== this.currentMusic.id)
            .slice(0, 6);
    }


	// 3. 카드 표시 데이터 변환 로직 (Card에서 사용)
	getDisplayInfo(item){ // 여기서  item은 개별 music객체
		return {
            mainText: item.title,
            subText: item.singer,
            meta: `${item.genre} · 👁️ ${item.viewed || 0}`,
            image: item.image 
			? `https://chois.cloud/api/files/musics/${item.id}/${item.image}`
			: item.thumbUrl
        };
	}


	// 5. 재생 및 곡 선택 핸들러
    async handlePlay(music) {
        if (this.currentMusic?.id === music.id) {
            // 같은 곡이면 토글
            this.isPlaying = !this.isPlaying;
        } else {
            // 다른 곡이면 교체 후 재생
            this.currentMusic = music;
            this.isPlaying = true;

            // 조회수 증가 (단순화: 호출 시마다 증가 혹은 필요시 서버 로직에서 처리)
            await musicActions.updateMusic(music.id, { 
                viewed: (music.viewed || 0) + 1 
            });
            // 로컬 상태 동기화 (서버 응답 기다리지 않고 즉시 반영)
            music.viewed = (music.viewed || 0) + 1;
        }

		if(this.isMobile){
			this.scrollToTop()
		}
    }
	// 플레이용 뮤직카드에서 카드 선택했을 때
    selectMusic(music) {    
		this.currentMusic = music;    
		if(this.isMobile){
			this.scrollToTop()
		}
    }
    
	// 공통 스크롤 함수 추가
    scrollToTop() {
        if (this.isMobile && typeof window !== 'undefined') {
            // 'Top'을 'top'으로 수정 (소문자 필수)
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

	get videoUrl() {
		if (!this.currentMusic || !this.currentMusic.src) return "";
		
		let src = this.currentMusic.src;
		
		// 1. 이미 embed 주소인 경우 그대로 반환
		if (src.includes('youtube.com/embed/')) return src;
		//보안을 위해 밖에서 embed없는 주소로 오면 브라우저에서 막힘.

		// 2. 일반 youtube.com/watch?v=... 주소인 경우 변환
		if (src.includes('watch?v=')) {
			const videoId = src.split('v=')[1]?.split('&')[0];
			return `https://www.youtube.com/embed/${videoId}`;
		}

		// 3. youtube.be/... (단축 주소)인 경우 변환
		if (src.includes('youtu.be/')) {
			const videoId = src.split('youtu.be/')[1]?.split('?')[0];
			return `https://www.youtube.com/embed/${videoId}`;
		}

		// 변환할 수 없는 경우 원본 반환 (혹은 에러 처리)
		return src;
	}

	// 6. 데이터베이스에서 데이터 불러온 이후 초기화 및 유틸리티
    init() {
        this.searchTerm = '';
        this.selectedIds = new Set();
        this.isPlaying = false;
        // 첫 번째 곡을 기본 선택값으로 잡고 싶다면 musicActions.init() 이후에 실행
        if (musicState.allMusics.length > 0) {
            this.currentMusic = musicState.allMusics[0];
			console.log("현재음악:", this.currentMusic.src)
        }
    }

	   
}

export const musicUI = new MusicUI();