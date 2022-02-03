<script context="module">
  export const prerender = true;
</script>

<script lang="ts">
  import Head from '$lib/Head.svelte'
  import Social from '$lib/Social.svelte'
  import ToggleTheme from '$lib/ToggleTheme.svelte'
  import {getTodaysRule, ruleStrings, compareRules} from '$lib/Rulebook'
  import {verifyPattern} from '$lib/Checker'
  import { fade, fly } from 'svelte/transition';

  const url = "https://lemononmars.github.io/zendle"
  const title = "Zendle"
  const description = "Deduction game"
  const imageUrl = ""
  const gtagId = "G-YTV7TZ3EMC"

  const symbolString = ['🔴','🟡','🔵','🟥','🟨','🟦']//'❤','💛','💙',
  const verifiedSymbol = ['❌','✔️']

  let ruleColors = ["btn-primary", "btn-secondary","btn-accent","btn-info","btn-secondary","btn-accent", "btn-info"]
  
  
  let ruleGuess: number[] = [-1,-1,-1,-1,-1,-1,-1]
  // display only rules that are in the next part, and that will be grammatical
  $: availableRule = ruleGuess.map((t,tidx)=>
    ruleStrings[tidx].map((s, sidx) => 
      checkedAvailableRule(tidx,sidx)
    )
  )
  $: ruleGuessString = ruleGuess.reduce((prev, r, idx)=>
    prev + (r==-1?"": " " + ruleStrings[idx][r])
  , "")

  // February 4, 2022 Game Epoch
  const epochMs = 1643907600000
  const now = Date.now()
  const msInDay = 86400000
  const dateIndex = Math.floor((now - epochMs) / msInDay)
  let ruleSolution = getTodaysRule(dateIndex)
  $: ruleSolutionString = ruleSolution.reduce((prev, r, idx)=>
    prev + (r==-1?"": " " + ruleStrings[idx][r])
  , "")

  type display = number[] | string
  let input: number[] = []
  let attempts: Array<display> = []
  let validation: boolean[] = []
  $: inputSymbols = toSymbolString(input)
  let gameEnded: boolean = false

  function submit(){
    if(input.length == 0)
      return
    attempts = [...attempts, input]
    validation = [...validation, verifyPattern(input, ruleSolution)]
    input = []
  }

  function toSymbolString(s: display): string{
    if (typeof s === "string")
      return s +"."
    else
      return s.map((id)=>symbolString[id]).join("")
  }

  function toSymbolStringShare(s: display): string{
    let str = verifiedSymbol[+verifyPattern(s, ruleSolution)] +  ":"
    if (typeof s === "string")
      str += s + "."
    else
      str += s.map((id)=>symbolString[id]).join("")
    return str
  }

  function checkedAvailableRule(type: number, id: number): boolean{
    switch(type){
      case 0: return true;
      case 1: return ruleGuess[0] == 0
      case 2: 
      case 3: return ruleGuess[0] == 1 || ruleGuess[1] >= 0;
      case 4: return (ruleGuess[2] >=0 || ruleGuess[3] >= 0) &&(
        (ruleGuess[0] == 0 && id == 0)
        || (ruleGuess[0] == 1 && id >= 1)
      );
      case 5:
      case 6: return ruleGuess[4] >= 0;
      default: break;
    }
    return true
  }

  function guessTheRule(){
    if(compareRules(ruleGuess, ruleSolution)){
      attempts = [...attempts, ruleGuessString]
      ruleGuess = ruleGuess.fill(-1)
      return
    }
    gameEnded = true
  }

  function copyResult() {
    const results = attempts.map((at)=>toSymbolStringShare(at)).join("\n")
      + "\n\nCan you guess the rule?"

    navigator.clipboard.writeText(
      `#Zendle Day ${dateIndex + 1} (${attempts.length} attempts)\n\n${results}`
    )
  }
</script>

<Head {title} {description} {url} {imageUrl} {gtagId} />

<h1 class="text"> Zendle: Day {dateIndex+1} </h1>

<span>{ruleSolutionString}</span>

<div class="form-control overflow-y-auto flex flex-col items-center w-full">
  {#each attempts as at, idx}
    <div class={`card card-bordered card-compact w-full lg:w-1/2 border-2 ${validation[idx]?"border-green-400":"border-red-400"}`}>
      <div class="card-body align-left h-12">
        <p>{`${toSymbolString(at)}`}</p>
      </div>
    </div> 
  {/each}
  {#if gameEnded}
    <div class={`card card-bordered card-compact w-full lg:w-1/2 border-2 bg-green-900`}>
      <div class="card-body align-left h-12">
        <p>{ruleGuessString}.</p>
      </div>
    </div> 
  {:else}
    <div class={`card card-bordered card-compact w-full lg:w-1/2 border-2 border-white-700 bg-gray-700`}>
      <div class="card-body align-left h-12">
        <p>{inputSymbols}</p>
      </div>
    </div> 
  {/if}
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
    {#if gameEnded}
      <button class="btn input-secondary" on:click={copyResult}>
        Share</button
      >
    {:else}
      <button class="btn input-secondary" on:click={()=>{
        input = []
      }}>
        Clear</button
      >
      <button class="btn input-primary" on:click={submit}>
        Submit</button
      >
    {/if}
  </div>
</div>

{#if !gameEnded}
  <label for="my-modal-2" class="btn btn-primary modal-button">Guess the rule!</label> 
{/if}
<input type="checkbox" id="my-modal-2" class="modal-toggle"> 
<div class="modal w-auto">
  <div class="modal-box"> 
    <div class="flex flex-col justify-center items-center gap-3">
      {#each ruleStrings as rs, tidx}
        <div class="flex flex-row">
          {#each rs as s, id}
            <button 
              class="btn btn-xs {ruleColors[tidx]}" 
              class:btn-outline="{ruleGuess[tidx] != id}"
              class:opacity-25="{!availableRule[tidx][id]}"
              class:btn-disabled="{!availableRule[tidx][id]}"
              on:click={()=>{
                if(ruleGuess[tidx] == id) 
                  ruleGuess = ruleGuess.fill(-1,tidx)
                else
                  ruleGuess[tidx] = id
              }}
            >{s}</button>
          {/each}
        </div>
      {/each}
    </div>
    <span>{ruleGuessString}</span>
    <div class="modal-action flex-row justify-center">
      <label for="my-modal-2" class="btn btn-primary" on:click={guessTheRule}>Submit</label> 
      <button class="btn btn-info" on:click={()=>{ruleGuess = ruleGuess.fill(-1)}}>Reset</button>
      <label for="my-modal-2" class="btn">Back</label>
    </div>
  </div>
</div>


<footer class="p-4 footer  text-base-content bg-base-300 dark:bg-base-800 footer-center">
  <div class="flex flex-row justify-center">
    <a href="https://github.com/lemononmars/zendle" target="_blank" class="link link-primary">Github</a>
    <a href="https://twitter.com/SakulbuthE" target="_blank" class="link link-primary">เสนอแนะ/แจ้งบัค</a>
    <Social {url} {title} {description}/>
    <!--ToggleTheme/> <-->
  </div>
</footer>