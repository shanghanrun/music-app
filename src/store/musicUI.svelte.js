import { musicState, musicActions, reviewActions } from "$lib/pb.svelte"
import { pb } from "$lib/pb.svelte"


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
	sortKey = $state('viewed') // 사용자가 선택하는 값

	// 실제 정렬에 사용 중인 상태 
    currentSortKey = $state('viewed'); 
    sortOrder = $state('desc'); 

	// 노래선택, 재생관련 상태
	currentMusic = $state(null)
	isPlaying = $state(false)

	currentTrackIndex =$state(0) //현재 재생 중인 곡의 순번
	playMode =$state('linear') // linear(연속), shuffle(셔플), standard(표준)
	// 1. 상태 하나 추가 (사용자가 직접 클릭해서 리스트를 고정하고 싶은지 여부)
	isManualSelection = $state(false);

	reviewText =$state("")
	reviews = $state([]); // 리뷰 목록을 담을 배열
	reviewTrigger = $state(0)


	// 1. 다음 곡 재생 로직 (유튜브 Player API의 onEnded 이벤트 등에서 호출)
    playNext = () => {
        if (this.list.length === 0 || !this.currentMusic) return;

		// 1. 표준 모드일 때 처리
		if (this.playMode === 'standard') {
			console.log("표준 모드: 한 곡 재생 완료 후 정지");
			this.isPlaying = false; // 재생 중지 (한 곡 반복을 원하시면 다시 playVideo 호출)
			this.isManualSelection = true; // 상단 고정 유지
			return;
		}

		// 자동 재생 시에는 리스트 순서 고정을 해제 (정렬 순서대로 흐르게)
    	this.isManualSelection = false;

		// 현재 곡의 '고유 ID'를 기준으로 인덱스를 찾습니다.
		const currentIndex = this.list.findIndex(m => m.id === this.currentMusic.id);
		let nextIndex = currentIndex + 1;

		if (this.playMode === 'shuffle') {
			// ⭐️ 셔플 모드: 현재 곡 제외하고 무작위 선택
			let randomIndex;
			do {
				randomIndex = Math.floor(Math.random() * this.list.length);
			} while (this.list.length > 1 && randomIndex === currentIndex);
			nextIndex = randomIndex;
		} else {
			// ⭐️ 연속(linear) 모드: 다음 곡으로, 끝이면 처음으로
			nextIndex = currentIndex + 1;
			if (nextIndex >= this.list.length) nextIndex = 0;
		}

		// ⭐️ 중요: 단순히 인덱스로 바꾸는 게 아니라, 
		// 현재 재생 중인 '객체' 자체를 확실히 고정합니다.
		this.currentMusic = this.list[nextIndex];
		this.isPlaying = true;
        
        // ⭐️ 핵심: 연속/셔플 재생 시에는 스크롤을 올리지 않고 재생만 합니다.
        this.autoHandlePlay(nextMusic);
    }

    // 2. 수동 클릭이 아닌 '시스템'에 의한 자동 재생용 함수
    autoHandlePlay = async (music) => {
        this.currentMusic = music;
        this.isPlaying = true;
        
        // 조회수 증가 및 로컬 반영
        await musicActions.updateMusic(music.id, { viewed: (music.viewed || 0) + 1 });
        music.viewed = (music.viewed || 0) + 1;

        // [참고] 여기서는 scrollToTop()을 호출하지 않습니다!
    }

    // 3. 기존 handlePlay 수정 (사용자가 직접 클릭했을 때)
    handlePlay = async (music) => {
		this.isManualSelection = true; // 수동 선택임을 명시

        if (this.currentMusic?.id === music.id) {
            this.isPlaying = !this.isPlaying;
        } else {
            this.currentMusic = music;
            this.isPlaying = true;

            await musicActions.updateMusic(music.id, { 
                viewed: (music.viewed || 0) + 1 
            });
            music.viewed = (music.viewed || 0) + 1;
        }

        // 사용자가 '직접' 목록에서 곡을 선택했을 때만 상단으로 보냅니다.
        if(this.isMobile){
            this.scrollToTop();
        }
    }

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
	get list() {
		const term = this.searchTerm.toLowerCase();
		let filtered = musicState.allMusics.filter(m => (
			m.title.toLowerCase().includes(term) || m.singer.toLowerCase().includes(term)
		));

		// 기본 정렬 수행
		filtered.sort((a, b) => {
			const valA = String(a[this.currentSortKey]);
			const valB = String(b[this.currentSortKey]);
			return this.sortOrder === 'asc' 
				? valA.localeCompare(valB, undefined, { numeric: true })
				: valB.localeCompare(valA, undefined, { numeric: true });
		});

		// ⭐️ [개정된 모바일 로직]
		// 모바일이고 + 현재 곡이 있고 + '표준(standard)' 모드이거나 '수동 선택'일 때만 위로 올림
		// '연속(linear)'이나 '셔플(shuffle)' 모드일 때는 정렬 순서 그대로 둬야 도돌이표가 안 생깁니다.
		if (this.isMobile && this.currentMusic && (this.playMode === 'standard' || this.isManualSelection)) {
			const currentIndex = filtered.findIndex(m => m.id === this.currentMusic.id);
			if (currentIndex > -1) {
				const [selectedItem] = filtered.splice(currentIndex, 1);
				filtered.unshift(selectedItem);
			}
		}
		
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
    async init() {
        this.searchTerm = '';
        this.selectedIds = new Set();
        // this.isPlaying = false; //처음은 연속재생
		this.playMode ='linear'
        // 첫 번째 곡을 기본 선택값으로 잡고 싶다면 musicActions.init() 이후에 실행
        if (musicState.allMusics.length > 0) {
            this.currentMusic = musicState.allMusics[0];
			console.log("현재음악:", this.currentMusic.src)
        }
    }

	saveReview=async()=> {
        // if (!this.currentMusic) {
        //     alert("먼저 노래를 선택해주세요!");
        //     return;
        // }
        if (!this.reviewText.trim()) {
            // alert("감상평을 입력해주세요~");
            return;
        }

        try {
			console.log('리뷰 글: ', this.reviewText)
            const newReview = await reviewActions.addReview(this.reviewText);
            // 목록 맨 앞에 방금 쓴 리뷰 추가 (새로고침 없이 바로 보이게!)
            this.reviews = [newReview, ...this.reviews];
            this.reviewText = ""; //입력창 비우기
            // await reviewActions.addReview(this.currentMusic.id, this.reviewText);
            // alert("감상평이 등록되었습니다! ✍️");
			this.reviewTrigger++
        } catch (e) {
            alert("저장 중 오류가 발생했습니다.");
        }
    }

	// 리뷰 불러오기 (onMount, $effect 등에서 호출)
    async loadReviews() {
        try {
            // PocketBase에서 삭제되지 않은 리뷰를 최신순으로 가져오기
            this.reviews = await pb.collection('reviews').getFullList({
                filter: 'isDeleted = false',
                sort: '-created', // 최신글이 위로
            });
			console.log('reviews : ', this.reviews)
        } catch (e) {
            console.error("리뷰 로드 실패:", e);
        }
    }   
}

export const musicUI = new MusicUI();