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
        // if (!verifyAdmin()) return;

        const parsedData = this.transferText2Data(rawText);
        if (parsedData.length === 0) return alert("입력된 데이터가 없거나 형식이 잘못되었습니다.");

        let successCount = 0;
        let failList = []; // 실패한 곡 정보를 담을 리스트

        try {
            for (const item of parsedData) {
                try {
                    // 한 곡씩 시도
                    await pb.collection('musics').create(item);
                    successCount++;
                } catch (singleErr) {
                    // 에러 발생 시 멈추지 않고 기록만 함
                    console.error(`❌ 저장 실패: ${item.title}`, singleErr);
                    failList.push(`${item.title} (이유: ${singleErr.message})`);
                }
            }

            // 결과 보고
            let resultMsg = `${successCount}곡이 성공적으로 등록되었습니다!`;
            
            if (failList.length > 0) {
                resultMsg += `\n\n⚠️ 실패한 항목 (${failList.length}건):\n` + failList.join('\n');
                alert(resultMsg); // 실패 내역이 있으면 상세히 알림
            } else {
                alert(resultMsg);
            }

            // 성공한 게 하나라도 있다면 목록 갱신
            if (successCount > 0) {
                location.reload();
            }

        } catch (err) {
            console.error("일괄 작업 중 예기치 못한 전체 오류:", err);
        }
    } 
    // 중복된 src(동영상)이 들어오는 것을 막기 위해, db에 src항목을 unique로 체크한다.
})