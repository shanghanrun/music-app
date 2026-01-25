<script>
	let { item, i } = $props()
</script>

<li class="rank-line">
	<span class="rank">{i + 1}</span>
	<span class="name">{item.title} : {item.singer}</span>
	<span class="count">{item.viewed || 0} v</span>
</li>


<style>
	.rank-line{
		display: flex;
		justify-content: space-between;
		font-size: 3 rem;
		margin-bottom: 10px;
		/* padding: 12px; */
		border-bottom: 1px solid #cdd6e3;
	}
	
	.rank { font-weight: bold; color: #ff4d4f; }
	.name {}
	.count{ font-weight: bold; color: #4c67ff;}
</style>