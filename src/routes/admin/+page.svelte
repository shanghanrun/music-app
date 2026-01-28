<script>
import { musicActions } from '$lib/pb.svelte.js';
import { musicUI } from '../../store/musicUI.svelte';
import { onMount } from 'svelte';
import BatchForm from '../../component/BatchForm.svelte';
  import EditableMusicListView from '../../component/EditableMusicListView.svelte';
  import EditableMusicCard from '../../component/EditableMusicCard.svelte';
  import MusicForm from '../../component/MusicForm.svelte';
  import MusicRank from '../../component/MusicRank.svelte';
  import MusicRankCard from '../../component/MusicRankCard.svelte';

    onMount(async ()=> {
		await musicActions.init(); // 데이터 먼저 로드
		musicUI.init(); // UI 초기화. 현재 곡 등		
	}) 
    // console.log('top viewed', musicUI.topViewed)
    // console.log('top viewed', musicUI.topViewed[0])
    // console.log('top viewed', musicUI.topViewed[0]?.title)

</script>

<div class="admin-container">
    <EditableMusicListView>
        {#each musicUI.list as music (music.id)}
                <EditableMusicCard item={music} />
        {/each}
    </EditableMusicListView>
    
    <MusicForm />
    
    <section class="col">
        <MusicRank>
            {#each musicUI.topViewed as music, i }
                <MusicRankCard item={music} i={i}/>
            {/each}
        </MusicRank>

        <BatchForm />
    </section>
</div>

<style>
    .admin-container { 
        display: grid; 
        grid-template-columns: 1fr 1fr 1fr; 
        gap: 20px; 
        padding: 20px; 
        min-height: 100vh; 
        background: #f0f2f5; 
        box-sizing: border-box;
    }

    /* 모든 직계 자식(컴포넌트들)에 기본 order 부여 */
    .admin-container > :global(*) {
        order: unset;
    }

    section.col { 
        background: white; 
        padding: 24px; 
        border-radius: 12px; 
        display: flex; 
        flex-direction: column; 
        overflow: hidden; 
        box-shadow: 0 4px 6px rgba(0,0,0,0.05); 
    }

    /* [중단 화면] 769px ~ 1024px */
    @media (max-width: 1024px) {
        .admin-container {
            grid-template-columns: 1fr 1fr; /* 2열 구조 */
            height: auto;
        }

        /* 1번 자식 (리스트): 그대로 1번 위치 */
        .admin-container > :global(*:nth-child(1)) {
            order: 1;
        }

        /* 2번 자식 (MusicForm): 맨 아래로 보내고 가로 2칸 다 차지 */
        .admin-container > :global(*:nth-child(2)) {
            grid-column: span 2;
            order: 3; 
        }

        /* 3번 자식 (랭크 섹션): 2번 위치(우측 상단)로 이동 */
        .admin-container > :global(*:nth-child(3)) {
            order: 2;
        }
    }

    /* [모바일] 768px 이하 */
    @media (max-width: 768px) {
        .admin-container {
            grid-template-columns: 1fr; /* 1열 구조 */
            padding: 10px;
            gap: 15px;
            height: auto;
        }

        /* 모바일에서는 순서를 다시 원래대로(리스트-폼-랭크) 정렬 */
        .admin-container > :global(*) {
            grid-column: span 1 !important;
            order: unset !important;
        }

        section.col {
            padding: 16px;
        }
    }
</style>