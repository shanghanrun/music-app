<script>
    import { musicUI } from "../../store/musicUI.svelte"; 
    import MusicListView from "../../component/MusicListView.svelte";
    import EditableMusicListView from "../../component/EditableMusicListView.svelte";
    import MusicCard from "../../component/MusicCard.svelte";
    import EditableMusicCard from "../../component/EditableMusicCard.svelte";
  	import { musicActions } from "$lib/pb.svelte";
  	import { onMount } from 'svelte';
  import MusicVideoPlayer from "../../component/MusicVideoPlayer.svelte";
  import RelatedMusicContainer from "../../component/RelatedMusicContainer.svelte";
  import RelatedMusicListView from "../../component/RelatedMusicListView.svelte";
  import RelatedMusicCard from "../../component/RelatedMusicCard.svelte";

	// 1. 페이지가 열리면 서버에서 데이터를 싹 긁어와서 musicState.allMusics를 채웁니다.
	onMount(async ()=> {
		await musicActions.init(); // 데이터 먼저 로드
		musicUI.init(); // UI 초기화. 현재 곡 등
		
	}) 
</script>

<!-- 좌측 칼럼 -->
<MusicListView>
	{#if musicUI.isMobile}
            <div class="mobile-player-area">
                <MusicVideoPlayer />
            </div>
    {/if}
    {#each musicUI.list as music (music.id)}
        <MusicCard item={music} />
    {/each}
</MusicListView>


<!-- 중앙 칼럼 -->
<!-- iframe 동영상
relatedMusic란( RelatedMusicListView/ RelatedMusicCard) -->

{#if !musicUI.isMobile}
	 <div class="mobile-player-area">
                <MusicVideoPlayer />
	</div>
{/if}

<RelatedMusicContainer>
	<RelatedMusicListView>
	{#each musicUI.relatedMusics as rm (rm.id)}
		<RelatedMusicCard item={rm} />
	{/each}
	</RelatedMusicListView>
</RelatedMusicContainer>



<!-- 우측 칼럼 -->
<!-- 가사란(originalTextArea, translationTextArea, etcTextArea) -->


<!-- //=======adminPage=============//
좌측칼럼
<EditableMusicListView> sort,  체크된 것 삭제버튼 있는 것
   <EditableMusicCard> 체크박스,수정,삭제 버튼 있는 것


중앙칼럼
입력폼 <MusicForm></MusicForm>

우측칼럼
랭크리스트 RankListView/ RankCard
데이터일괄추가Form BatchForm -->


<style>
    .layout-container { display: flex; gap: 20px; }
    
    /* 모바일에서는 상세 영역을 숨기고 리스트 내부에 합쳐짐 */
    @media (max-width: 767px) {
        .desktop-content-area { display: none; }
        .mobile-player-area { 
            position: sticky; 
            top: 0; 
            z-index: 100; 
            background: white;
            padding: 10px 0;
        }
    }
</style>