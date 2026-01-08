import { pb } from "./pb.svelte";
import { getThumbUrl } from "./youtubeUtil";

// 관리자 비밀번호 확인 함수
export function verifyAdmin() {
    const password = prompt("관리자 비밀번호를 입력하세요:");
    if (password === "741852") {
        return true;
    } else {
        alert("비밀번호가 올바르지 않습니다.");
        return false;
    }
}

export const musicStore = $state({
    list: [],
    // 어제 우리가 함께 만든 정교한 파싱 로직
    transferText2Data(rawText) {
        const songs = rawText.split(';').map(item => item.trim()).filter(Boolean);
        
        return songs.map(song => {
            const lines = song.split('\n')
                .map(line => line.trim())
                .filter(line => line !== "")
                .filter(Boolean);

            if (lines.length !== 5) {
                console.error(`🚨 [입력 에러] "${lines[0] || '제목없음'}" 항목 확인 필요`);
                return null;
            }

			const thumbUrl = getThumbUrl(lines[4])

            return {
                title: lines[0],
                singer: lines[1],
                genre: lines[2],
                theme: lines[3],
                src: lines[4],
				thumbUrl: thumbUrl
            };
        })
    },

    // DB에 일괄 저장하는 함수
    async batchInsert(rawText) {
		// 작업 전 비밀번호 확인
		if (!verifyAdmin()) return;

        const parsedData = this.transferText2Data(rawText);
        if (parsedData.length === 0) return alert("입력된 데이터가 없거나 형식이 잘못되었습니다.");

        try {
            for (const item of parsedData) {
                await pb.collection('musics').create(item);
            }
            alert(`${parsedData.length}곡이 성공적으로 등록되었습니다!`);
            location.reload(); // 간단하게 목록 갱신
        } catch (err) {
            console.error("DB 저장 중 오류:", err);
        }
    }
});