// title, singer, genre, theme, src 순서 5개항목
// ; 로 나눔, 
// 에러 컨트롤:  ';'로 나눈 것을 '\n'을 기준으로 슬라이싱하고, 'trim'해서 공백문자열을 제거,
// 그러고서 나온 배열요소가 5개인지 확인한다. 만약 5개가 아니면, 에러가 난 해당 항목의 첫번째 문자열을 
// 보여주면서, 해당부분에 문제가 있다고 알려준다. 

const rawText = `
세월이 가면
최호섭
가요
이별 
https://www.youtube.com/watch?v=m9Wc39NWqf8&list=RDI2i4l2GHklQ&index=2
;
눈물나는 날에는
푸른하늘
가요
삶
https://www.youtube.com/watch?v=poJWKsH_HAU
;
지난 날
유재하
가요
회상
https://www.youtube.com/watch?v=0_ZJfwM2bMs&list=RD0_ZJfwM2bMs&start_radio=1
;
내 마음에 비친 내 모습
유재하
가요
삶
https://www.youtube.com/watch?v=YV2DgghNaWs&list=RDYV2DgghNaWs&start_radio=1
;
사랑하게 될 줄 알았어
전미도
가요
사랑
https://www.youtube.com/watch?v=rOCymN-Rwiw&list=RDrOCymN-Rwiw&start_radio=1
;
네버엔딩스토리
부활
가요
이별
https://www.youtube.com/watch?v=VwkktTmIrxs&list=RDVwkktTmIrxs&start_radio=1
;
I like chopin
Gazebo
pop
사랑
https://www.youtube.com/watch?v=cv7R2lNbuJA&list=RDcv7R2lNbuJA&start_radio=1
;
Nothing’s gonna stop us now
Starship
pop
사랑
https://www.youtube.com/watch?v=3wxyN3z9PL4&list=RD3wxyN3z9PL4&start_radio=1
;
I can dream about you
Dan Hartman
pop
사랑
https://www.youtube.com/watch?v=621Nk3Ubz4A&list=RD621Nk3Ubz4A&start_radio=1
;

Shape of my life

Sting
pop
삶
https://www.youtube.com/watch?v=dIB9D5qiU1g&list=RDdIB9D5qiU1g&start_radio=1
;
First love(첫사랑)
Epitone Project(에피톤 프로젝트)
가요
사랑
https://www.youtube.com/watch?v=3w5iMGSHvsE&list=RD3w5iMGSHvsE&start_radio=1
;
나무
카더가든
가요
사랑
https://www.youtube.com/watch?v=cHkDZ1ekB9U&list=RD3w5iMGSHvsE&index=2
`


//이것을 처리하기 위한 로직
function transferText2Data(rawText) {
    // 1. ';' 기준으로 곡 단위 분리
    const songs = rawText.split(';').map(item => item.trim()).filter(Boolean);

    const result = songs.map(song => {
        // 2. 줄바꿈으로 각 필드 분리
        const lines = song.split('\n')
							.map(line => line.trim())
							.filter(line => line.length > 0) // 공백라인제거에 효율적
							.filter(Boolean); // 혹시 모를 null, undefined 제거한 배열

		// filter(line => (line !=='')) // 공백라인 제거인데, 특수문자 라인 제거는 안된다.

		// 3. 에러 컨트롤
        if (lines.length !== 5) {
            const errorTitle = lines[0] || "제목 없음";
            // 실무에서는 console.log 대신 에러 객체를 던지거나 alert를 띄울 수 있습니다.
            console.error(`🚨 [입력 에러] "${errorTitle}" 항목의 데이터가 5개가 아닙니다. (현재 ${lines.length}개)`);
            return null; // 에러 발생 시 null 반환 (map함수에서 로직은 return이 있어야 됨)
        } else{
			// 4. 순서대로 객체화 (title, singer, genre, theme, src)

			const youtubeId = getYoutubeId(lines[4]);
			const thumbUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg` : '';

			return {
				title: lines[0],
				singer: lines[1],
				genre: lines[2],
				theme: lines[3],
				src: lines[4],
				thumbUrl: thumbUrl // 텍스트 필드에 저장            
			};
		}

    }); // 여기까지 result 

	return result
}

let result = transferText2Data(rawText);
console.log(result)


// 유튜브 URL에서 ID만 뽑아내는 함수
function getYoutubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
