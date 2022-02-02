<script context="module">
  export const prerender = true;
</script>

<script lang="ts">
  import Head from '$lib/Head.svelte'
  import Social from '$lib/Social.svelte'
  import ToggleTheme from '$lib/ToggleTheme.svelte'
  import {verifyPattern} from '$lib/checker'

  const url = "https://lemononmars.github.io/zendle"
  const title = "Zendle"
  const description = "Deduction game"
  const imageUrl = ""
  const gtagId = "G-YTV7TZ3EMC"

  const symbolString = ['❤','💛','💙','🔴','🟡','🔵','🟥','🟨','🟦']
  const ruleStrings = [
    ["No", "At least one", "Exactly one", "The number of"],
    ["blue", "red", "yellow"],
    ["heart", "circle", "square"],
    ["is in the string", "is to the left of", "is to the right of", "is equal to", "is less than", "is more than"],
    ["blue", "red", "yellow"],
    ["heart", "circle", "square"],
  ]
  let ruleColors = ["btn-primary", "btn-secondary","btn-accent","btn-info","btn-secondary","btn-accent"]
  
  let ruleSentence: number[] = [-1,-1,-1,-1,-1,-1]
  $: ruleActive = ruleSentence.map((r,idx)=>selectedPrevious(idx))
  
  $: ruleSentenceString = ruleSentence.reduce((prev, r, idx)=>
    prev + " " + (r==-1?"":ruleStrings[idx][r])
  , "")

  let input: number[] = []
  let attempts: number[][] = []
  $: inputSymbols = toSymbols(input).join("")

  let gameEnded: boolean = false

  function onKeypress(e: KeyboardEvent){
    if (e.key === "Enter") {
      e.preventDefault()
      submit()
    }
  }

  function submit(){
    if(input.length == 0)
      return
    attempts = [...attempts, input]
    input = []
  }

  function toSymbols(s: number[]){
    return s.map((id)=>symbolString[id])
  }

  function selectedPrevious(id: number){
    switch(id){
      case 0: return true;
      case 1: 
      case 2: return ruleSentence[0] >= 0;
      case 3: return ruleSentence[1] + ruleSentence[2] > -2;
      case 4:
      case 5: return ruleSentence[3] >= 0;
      default: break;
    }
    return true
  }
</script>

<Head {title} {description} {url} {imageUrl} {gtagId} />

<h1 class="text"> Zendle </h1>


<div class="form-control">
  {#each attempts as at}
    <div class={`card card-bordered card-compact border-2 ${verifyPattern(at)?"border-green-400":"border-red-400"}`}>
      <div class="card-body align-left">
        <p>{`${toSymbols(at).join("")}`}</p>
      </div>
    </div> 
  {/each}
</div>

<div>
  <input 
    class="input w-full" 
    disabled
    bind:value={ruleSentenceString}
  >
</div>

<div class="flex flex-row justify-center items-center gap-3">
  {#each ruleStrings as rs, id1}
    <div class="flex flex-col" class:opacity-25="{!ruleActive[id1]}">
      {#each rs as s, id2}
        <button 
          class={`btn btn-xs ${ruleColors[id1]}`} 
          class:btn-outline="{ruleSentence[id1] != id2}"
          on:click={()=>{
            if(ruleSentence[id1] == id2) 
              ruleSentence = ruleSentence.fill(-1,id1)
            else
              ruleSentence[id1] = id2
          }}
        >{s}</button>
      {/each}
    </div>
  {/each}
  <button class="btn btn-lg">Submit</button>
</div>

<div>
  <input 
    class="input" 
    disabled
    bind:value={inputSymbols}
  >
</div>

<div class="flex flex-row justify-center">
  <div class="gap-2">
    {#each symbolString as s, idx}
      <button class="btn bth-outline text-xl w-30 h-10" on:click={()=>{
        input = [...input, idx]
      }}>
        {s}</button
      >
      {#if idx % 3 == 2}
      <br>
      {/if}
    {/each}
    <button class="btn input-secondary" on:click={()=>{
      input = []
    }}>
      Clear</button
    >
    <button class="btn bth-outline" on:click={()=>{
      input.pop()
    }}>
      Back</button
    >
    <button class="btn input-primary" on:click={submit}>
      Submit</button
    >
  </div>
</div>

<ToggleTheme/>
<footer class="p-4 footer bg-base-300 text-base-content footer-center">
  <div class="flex flex-row justify-center">
    <a href="https://github.com/lemononmars/zendle" target="_blank" class="link link-primary">Github</a>
    <a href="https://twitter.com/SakulbuthE" target="_blank" class="link link-primary">เสนอแนะ/แจ้งบัค</a>
  <Social {url} {title} {description}/>
  </div>
</footer>