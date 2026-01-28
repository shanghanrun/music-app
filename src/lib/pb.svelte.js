import PocketBase from 'pocketbase';
import { PUBLIC_PB_URL } from '$env/static/public'; 
import { SvelteSet } from 'svelte/reactivity';
import { musicUI } from '../store/musicUI.svelte';

// console.log("📡 연결하려는 PB 주소:", PUBLIC_PB_URL);
export const pb = new PocketBase(PUBLIC_PB_URL)


// 음악 앱 전역 상태
export const musicState = $state({
    allMusics: [],      // 서버에서 가져온 전체 음악 목록
    favoriteIds: new SvelteSet(), // 사용자가 '좋아요' 한 음악 ID들
    isLoading: false
});



export const musicActions = {
    // ... 기존 init, toggleFavorite 함수들

    async init() {
        try {
            // PocketBase에서 musics 컬렉션의 모든 데이터를 가져옴 (생성일 역순)
            const records = await pb.collection('musics').getFullList({
                sort: '-viewed',
            });
            const record = await pb.collection('stats').getFirstListItem('name="total_visits"');
            musicUI.totalVisits = record?.count
            
            // 가져온 데이터를 상태에 저장
            musicState.allMusics = records; 
            console.log("🎵 데이터 로드 완료:", records.length, "개의 곡");
            console.log(musicState.allMusics)
        } catch (err) {
            console.error("❌ 데이터 불러오기 실패:", err);
        }
    },

    // 1. 새로운 음악 추가 (Create)
    async createMusic(newMusicData) {
        try {
            // PocketBase에 저장
            const record = await pb.collection('musics').create(newMusicData);
            
            // 로컬 상태(UI)에 즉시 반영
            musicState.allMusics = [...musicState.allMusics, record];
            
            console.log("✅ 새 음악이 추가되었습니다:", record.title);
            return record;
        } catch (err) {
            console.error("❌ 음악 추가 실패:", err);
            throw err;
        }
    },

    // 2. 기존 음악 정보 수정 (Update)
    async updateMusic(id, updatedData) {
        try {
            // PocketBase 업데이트
            const record = await pb.collection('musics').update(id, updatedData);
            
            // 로컬 상태 업데이트 (수정된 데이터만 교체)
            musicState.allMusics = musicState.allMusics.map(m => 
                m.id === id ? record : m
            );
            
            console.log("✅ 음악 정보가 수정되었습니다:", record.title);
            return record;
        } catch (err) {
            console.error("❌ 음악 수정 실패:", err);
            throw err;
        }
    },

    // 3. 음악 삭제 (Delete)
    async deleteMusic(id) {
        if (!confirm("정말로 이 음악을 삭제하시겠습니까?")) return;

        try {
            // PocketBase에서 삭제
            await pb.collection('musics').delete(id);
            
            // 로컬 상태에서 삭제 (UI 즉시 반영)
            musicState.allMusics = musicState.allMusics.filter(m => m.id !== id);
            
            // 만약 현재 재생 중인 곡이 삭제된 곡이라면 첫 번째 곡으로 변경
            // (selectedMusic은 컴포넌트 레벨에서 관리하므로 컴포넌트 로직에서 처리 권장)
            
            console.log("✅ 음악이 삭제되었습니다. ID:", id);
        } catch (err) {
            console.error("❌ 음악 삭제 실패:", err);
            throw err;
        }
    },
    async deleteMultiple(ids) {
        try {
            // 1. 서버(PocketBase)에서 삭제
            // (순차적으로 삭제하지만, 병렬로 하려면 Promise.all을 써도 됩니다)
            for (const id of ids) {
                await pb.collection('musics').delete(id);
            }

            // 2. [핵심 수정] 로컬 상태 반영
            // 내가 방금 지운 'ids' 목록에 포함되지 않은 녀석들만 남긴다!
            musicState.allMusics = musicState.allMusics.filter(m => !ids.includes(m.id));
            
            console.log(`✅ ${ids.length}개 음악이 삭제되었습니다.`);
        } catch (err) {
            console.error("❌ 음악 삭제 실패:", err);
            throw err;
        }
    },
	async incrementView(musicId) {
		try {
            console.log('viewed 증가 로직 시작')
			// 유저에게 알리지 않고 백그라운드에서 실행
			// 기존 update 호출 부분에 { requestKey: null } 옵션을 추가합니다.
            await pb.collection('musics').update(id, {
                'viewed+': 1  // 조회수 1 증가 (PocketBase 필드 연산 기능)
            }, { 
                requestKey: null // 자동 취소를 비활성화하여 모든 요청을 처리함
            })
			
			// 로컬 상태(musicState)만 살짝 업데이트해서 우측 통계에 즉시 반영
			const index = musicState.allMusics.findIndex(m => m.id === musicId);
			if (index !== -1) {
				musicState.allMusics[index].viewed = record.viewed;
                console.log('viewed가 증가했습니다.')
			}
		} catch (err) {
			// 사용자에게 경고창을 띄우지 않고 콘솔에만 기록 (사용자 경험 방해 금지)
			console.error("Silent view increment failed:", err);
		}
	}
};

export const reviewActions = {
    //reviews컬렉션은 music뿐만 아니라, 다양한 곳에서의 리뷰를 모으는 컬렉션,
    // 그래서 music에 관한 review는 music필드에 텍스트로 저장된다.
    async addReview(content) {
        try {
            const data = {
                // "music": musicId,      // 연결된 음악 ID
                "music": content,       // 감상평 내용
                "isDeleted": false     // 기본값
            };
            const record = await pb.collection('reviews').create(data);
            return record.music;
        } catch (error) {
            console.error("리뷰 저장 실패:", error);
            throw error;
        }
    }
};

export const statActions = {
    // 전체 방문자 수 1 증가시키기
    async incrementTotalVisits() {
        try {
            // 'total_visits'라는 이름을 가진 레코드를 찾음
            const record = await pb.collection('stats').getFirstListItem('name="total_visits"');
            await pb.collection('stats').update(record.id, {
                count: (record.count || 0) + 1
            });
            return record.count + 1;
        } catch (e) {
            console.error("방문자 수 업데이트 실패:", e);
        }
    }
    
};