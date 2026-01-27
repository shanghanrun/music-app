import { musicState, musicActions, reviewActions, statActions } from "$lib/pb.svelte"
import { pb } from "$lib/pb.svelte"

class MusicUI{
    isMobile = $state(false)
    // 나만의 통계: 사용자 방문 횟수 (로컬 스토리지 연동 권장)
    totalVisits = $state(0);

    async updateGlobalVisits() {
        const newCount = await statActions.incrementTotalVisits();
        if (newCount) {
            this.totalVisits = newCount;
            console.log('🌍 전 세계 사용자 총 방문 횟수: ', this.totalVisits);
        }
    }

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

    currentTrackIndex =$state(0) // 현재 재생 중인 곡의 순번
    playMode =$state('linear') // linear(연속), shuffle(셔플), standard(표준)
    // 1. 상태 하나 추가 (사용자가 직접 클릭해서 리스트를 고정하고 싶은지 여부)
    isManualSelection = $state(false);

    reviewText =$state("")
    reviews = $state([]); // 리뷰 목록을 담을 배열 (절대 생략 금지!)
    reviewTrigger = $state(0)


    // 1. 다음 곡 재생 로직 (유튜브 Player API의 onEnded 이벤트 등에서 호출)
    playNext = async () => {
        if (this.list.length === 0 || !this.currentMusic) return;

        // 1. 표준 모드일 때 처리
        if (this.playMode === 'standard') {
            console.log("표준 모드: 한 곡 재생 완료 후 정지");
            this.isPlaying = false; 
            this.isManualSelection = true; 
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

        const nextMusic = this.list[nextIndex];
        
        if (nextMusic) {
            this.currentMusic = nextMusic; 
            this.isPlaying = true;
            
            // ⭐️ 시스템 자동 재생 함수 호출 (스크롤 안 함)
            this.autoHandlePlay(nextMusic);
        }
    }

    // 2. 수동 클릭이 아닌 '시스템'에 의한 자동 재생용 함수
    autoHandlePlay = async (music) => {
        this.currentMusic = music;
        this.isPlaying = true;
        
        // 조회수 증가 및 로컬 반영
        await musicActions.updateMusic(music.id, { viewed: (music.viewed || 0) + 1 });
        music.viewed = (music.viewed || 0) + 1;

        // viewed도 자동증가시킨다.
        await musicActions.incrementView(music.id)
    }

    // 3. 기존 handlePlay 수정 (사용자가 직접 클릭했을 때)
    handlePlay = async (music) => {
        this.isManualSelection = true; // 수동 선택임을 명시

        // 1. 같은 곡을 눌렀을 때: 토글
        if (this.currentMusic?.id === music.id) {
            this.isPlaying = !this.isPlaying;
        } 
        // 2. 다른 곡을 눌렀을 때: 곡 변경 및 무조건 재생
        else {
            this.currentMusic = music;
            this.isPlaying = true;

            // 조회수 증가 (DB업데이트)
            await musicActions.incrementView(music.id);
            // 로컬 데이터 즉시 반영 (화면 숫자 갱신용)
            music.viewed = (music.viewed || 0) + 1;
        }

        if(this.isMobile){
            this.scrollToTop();
        }
    }

    // 플레이리스트의 카드에서 선택 여부 확인
    isCurrent(id){
        return this.currentMusic?.id === id;
    }

    // 통계용: 조회수 상위 5개 계산
    get topViewed() {
        return [...musicState.allMusics]
            .sort((a, b) => (b.viewed || 0) - (a.viewed || 0))
            .slice(0, 5)
    }

    // 1. 검색어 + 정렬이 통합된 리스트
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

        // 모바일 로직
        if (this.isMobile && this.currentMusic && (this.playMode === 'standard' || this.isManualSelection)) {
            const currentIndex = filtered.findIndex(m => m.id === this.currentMusic.id);
            if (currentIndex > -1) {
                const [selectedItem] = filtered.splice(currentIndex, 1);
                filtered.unshift(selectedItem);
            }
        }
        
        return filtered;
    }

    // 정렬을 호출하는 함수
    applySort(){
        if (this.sortKey === this.currentSortKey){
            this.sortOrder = this.sortOrder === 'asc'? 'desc' : 'asc'
        } else{ 
            this.currentSortKey = this.sortKey;
            this.sortOrder = 'asc' 
        }
    }

    // 연관 곡 리스트
    get relatedMusics() {
        if (!this.currentMusic) return [];
        return musicState.allMusics
            .filter(m => m.theme === this.currentMusic.theme && m.id !== this.currentMusic.id)
            .slice(0, 6);
    }

    // 카드 표시 데이터 변환 로직
    getDisplayInfo(item){ 
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
    
    // 공통 스크롤 함수
    scrollToTop() {
        if (this.isMobile && typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // ✅ 검정 화면 문제 해결을 위해 autoplay 파라미터 추가
    get videoUrl() {
        if (!this.currentMusic || !this.currentMusic.src) return "";
        
        let src = this.currentMusic.src;
        let suffix = "?autoplay=1&mute=0&enablejsapi=1"; // 자동재생 유도
        
        // 1. 이미 embed 주소인 경우
        if (src.includes('youtube.com/embed/')) {
            return src.includes('?') ? `${src}&autoplay=1` : `${src}${suffix}`;
        }

        // 2. 일반 watch?v= 주소 변환
        if (src.includes('watch?v=')) {
            const videoId = src.split('v=')[1]?.split('&')[0];
            return `https://www.youtube.com/embed/${videoId}${suffix}`;
        }

        // 3. youtu.be/ 단축 주소 변환
        if (src.includes('youtu.be/')) {
            const videoId = src.split('youtu.be/')[1]?.split('?')[0];
            return `https://www.youtube.com/embed/${videoId}${suffix}`;
        }

        return src;
    }

    // 6. 데이터 로드 후 초기화
    async init() {
        this.searchTerm = '';
        this.isPlaying = false; 
        this.playMode ='linear'
        if (musicState.allMusics.length > 0) {
            this.currentMusic = musicState.allMusics[0];
            console.log("초기 곡 설정 완료:", this.currentMusic.title);
        }
    }

    // 리뷰 저장 (원본 유지)
    saveReview=async()=> {
        if (!this.reviewText.trim()) return;

        try {
            console.log('리뷰 글: ', this.reviewText)
            const newReview = await reviewActions.addReview(this.reviewText);
            this.reviews = [newReview, ...this.reviews];
            this.reviewText = ""; 
            this.reviewTrigger++
        } catch (e) {
            alert("저장 중 오류가 발생했습니다.");
        }
    }

    // 리뷰 불러오기 (원본 유지)
    async loadReviews() {
        try {
            this.reviews = await pb.collection('reviews').getFullList({
                filter: 'isDeleted = false',
                sort: '-created', 
            });
            console.log('reviews : ', this.reviews)
        } catch (e) {
            console.error("리뷰 로드 실패:", e);
        }
    }  
}

export const musicUI = new MusicUI();