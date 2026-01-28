import PocketBase from 'pocketbase';
import fs from 'fs';
import { musics } from './src/lib/data.js';

const pb = new PocketBase('https://chois.cloud');

async function upload() {
    try {
        // 1. 관리자 로그인
        await pb.collection('users').authWithPassword('id@2.com', '12345678');
        console.log("🔓 PocketBase 로그인 성공!");

        for (const item of musics) {
            const formData = new FormData();

            //유투브 영상주소 변환
            const cleanUrl = getEmbedUrl(item.src)
            
            // 2. 텍스트 데이터 필드 설정
            formData.append('title', item.title);
            formData.append('genre', item.genre);
            formData.append('theme', item.theme);
            formData.append('src', cleanUrl);
            formData.append('lyric', item.lyric);
            formData.append('koLyric', item.koLyric);
            formData.append('etc', item.etc || '');
            formData.append('singer', item.singer || '');
            // favorite은 보통 사용자별 favorites 컬렉션에서 관리하지만, 
            // 기본값 설정을 위해 포함한다면 문자열로 변환하여 넣습니다.
            formData.append('favorite', item.favorite ? 'true' : 'false');

            // 3. 파일(이미지) 처리 함수
            const addFile = (fieldName, localPath) => {
                if (localPath) {
                    // 데이터의 '/image/file.jpg'를 './static/image/file.jpg'로 변환
                    const filePath = `./static${localPath}`; 
                    
                    if (fs.existsSync(filePath)) {
                        const fileBuffer = fs.readFileSync(filePath);
                        const blob = new Blob([fileBuffer]);
                        // 파일 이름만 추출하여 전송
                        formData.append(fieldName, blob, localPath.split('/').pop());
                    } else {
                        console.warn(`⚠️ 파일을 찾을 수 없음: ${filePath}`);
                    }
                }
            };

            // 데이터의 image 속성을 PocketBase의 'image' 필드에 매칭
            addFile('image', item.image);

            // 4. 'musics' 컬렉션에 생성
            await pb.collection('musics').create(formData);
            console.log(`✅ 업로드 완료: ${item.title}`);
        }
        // console.log("🚀 모든 음악 데이터와 이미지가 서버에 저장되었습니다!");
    } catch (error) {
        console.error("❌ 상세 에러 정보:");
        console.error("상태 코드:", error.status);
        console.error("서버 응답:", error.data);
    }
}

function getEmbedUrl(url) {
    // 1. 유튜브 영상 ID만 추출하는 정규식
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
        const videoId = match[2];
        // 2. 임베드용 주소로 조립 (자동재생 등 옵션 추가 가능)
        return `https://www.youtube.com/embed/${videoId}`;
    } else {
        return url; // 실패 시 원본 반환
    }
}

// 사용 예시
// const rawUrl = "https://www.youtube.com/watch?v=wXTJBr9tt8Q&list=RDwXTJBr9tt8Q&start_radio=1";
// const cleanUrl = getEmbedUrl(rawUrl); 
// console.log(cleanUrl); // 결과: https://www.youtube.com/embed/wXTJBr9tt8Q

upload();