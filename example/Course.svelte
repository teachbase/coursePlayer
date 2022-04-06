<script>
  import Player from "./player.js";
  const player = new Player(14);
  let materials = [];
  let mats = {};
  const key = "authkey"
  player.login(key).then(()=>{
    player.getCourse().then((resp)=> {
      materials = resp.data.course.sections[0].materials;
      console.log(materials)
      })
    })
  player.on("passed", id => { console.log("Material was passed", id) })
  player.on("track", ()=> { console.log("TikTak") })
  player.on("openMaterial", material => { 
      console.log(material)
    })

  const openMaterial = (id)=> {
    mats = {};
    mats[id] = true
    player.openMaterial(id)
  };

  const close = (id)=> {
    mats = {};
    player.close();
  }
</script>

<main>
  <h1>Проект с плеером курса</h1>
  <div class="course">
    {#each materials as i}
      <p on:click="{()=> openMaterial(i.id)}" class="item">{i.title}</p>
      {#if mats[i.id]}
        <img src={i.source} width= 400/>
         <span on:click="{()=> close()}">close</span>
      {/if}
    {/each}
  </div>
</main>

<style>
</style>
