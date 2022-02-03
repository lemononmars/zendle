<script context="module">
  export const prerender = true;
</script>

<script lang="ts">
  import Head from '$lib/Head.svelte'
  import Social from '$lib/Social.svelte'
  import ToggleTheme from '$lib/ToggleTheme.svelte'
  import {getTodaysRule, ruleStrings, compareRules} from '$lib/Rulebook'
  import {verifyPattern} from '$lib/Checker'


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

  let ruleModal = false
  let optionModal = false
  let guessModal = false
  function closeAllModals(){
    ruleModal = false
    optionModal = false
    guessModal = false
  }

  function submit(){
    if(input.length == 0)
      return
    attempts = [...attempts, input]
    validation = [...validation, verifyPattern(input, ruleSolution)]
    window.scrollTo(0,document.body.scrollHeight)
    input = []
  }

  function guessTheRule(){
    if(compareRules(ruleGuess, ruleSolution)){
      attempts = [...attempts, ruleGuessString]
      ruleGuess = ruleGuess.fill(-1)
      return
    }
    gameEnded = true
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

  // ugly ......
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

  function copyResult() {
    const results = attempts.map((at)=>toSymbolStringShare(at)).join("\n")
      + "\n\nCan you deduce the rule?"

    navigator.clipboard.writeText(
      `#Zendle Day ${dateIndex + 1} (${attempts.length} attempts)\n\n${results}`
    )
  }

</script>

<Head {title} {description} {url} {imageUrl} {gtagId} />
<svelte:window on:click={closeAllModals}></svelte:window>

<div class="flex flex-col gap-2">
<span class="text-5xl"> Zendle: Day {dateIndex+1} </span>
<!--span>{ruleSolutionString}</span-->
  <div>
    <label for="my-modal-2" class="btn btn-primary modal-button shrink">Guess the rule!</label> 
  </div>
</div>

<div class="overflow-y-auto h-1/2">
  <div class="form-control flex flex-col items-center w-full gap-1">
    {#each attempts as at, idx}
      <div class="card card-bordered card-compact w-full lg:w-1/2 border-4 {validation[idx]?"border-green-400 border-double":"border-red-400 border-dashed"}">
        <div class="card-body text-lg h-12">
          <p>{toSymbolString(at)}</p>
        </div>
      </div> 
    {/each}
    {#if gameEnded}
      <div class="card card-bordered card-compact w-full lg:w-1/2 border-2 bg-green-900">
        <div class="card-body h-12">
          <p>{ruleGuessString}.</p>
        </div>
      </div> 
    {:else}
      <div class="card card-bordered card-compact w-full lg:w-1/2 border-2 shadow-2xl">
        <div class="card-body h-12">
          <p>{inputSymbols}</p>
        </div>
      </div> 
    {/if}
  </div>
</div>

<div class="flex flex-row justify-center absolute bottom-0 mb-4 inset-x-0">
  <div class="grid grid-cols-3 w-48 ">
    {#each symbolString as s, idx}
      <div>
        <button class="btn btn-outline text-xl w-15 h-15" on:click={()=>{
          input = [...input, idx]
        }}>
          {s}</button
        >
      </div>
    {/each}
    {#if gameEnded}
      <div>
      <button class="btn btn-primary" on:click={copyResult}>
        Share</button
      >
    </div>
    {:else}
      <button class="btn btn-secondary " on:click={()=>{
        input = []
      }}>
        Clear</button
      >
      <div></div>
      <button class="btn btn-primary" on:click={submit}>
        Check</button
      >
    {/if}
  </div>
</div>

<input type="checkbox" id="my-modal-2" class="modal-toggle"> 
<div class="modal w-auto">
  <div class="modal-box"> 
    <div class="flex flex-col justify-center items-center gap-3">
      <span class="text-xs lg:text-base text-wrap w-3/4">{ruleGuessString}</span>
      {#each ruleStrings as rs, tidx}
        <div class="flex flex-row flex-wrap justify-center">
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
    <div class="modal-action flex-row justify-center">
      <label for="my-modal-2" class="btn btn-primary" on:click={guessTheRule}>Submit</label> 
      <button class="btn btn-info" on:click={()=>{ruleGuess = ruleGuess.fill(-1)}}>Reset</button>
      <label for="my-modal-2" class="btn">Back</label>
    </div>
  </div>
</div>

<label for="modal-option" class="btn btn-info btn-sm fixed top-0 right-0 m-4 modal-button">Option</label> 
<input type="checkbox" id="modal-option" class="modal-toggle" > 
<div class="modal w-auto">
  <div class="modal-box"> 
    <div class="flex flex-col justify-center items-center gap-3">
      <ToggleTheme/>
      <Social {url} {title} {description}/>
      <a href="https://github.com/lemononmars/zendle" target="_blank" class="link link-primary">Github</a>
      <a href="https://twitter.com/SakulbuthE" target="_blank" class="link link-primary">Bug report/suggestion</a>   
    </div>
    <div class="modal-action flex-row justify-center">
      <label for="modal-option" class="btn">Back</label>
    </div>
  </div>
</div>

<label for="modal-rule" class="btn btn-info btn-sm modal-button fixed top-0 left-0 m-4">How to play</label> 
<input type="checkbox" id="modal-rule" class="modal-toggle" class:modal-open={ruleModal}> 
<div class="modal w-auto" class:modal-open={ruleModal}>
  <div class="modal-box text-left"> 
    <h1 class="text-3xl">Goal</h1>
    <p>Figure out the rule of the game. (aka <a class="link" href="https://boardgamegeek.com/boardgame/6830/zendo" target="_blank">Zendo</a>)</p>
    <div class="divider"></div> 
    <h1 class="text-3xl">How to play</h1>
    <p>nput a string of symbols of any length. The string will be verified with the rule, and the border will change accordingly</p><br>
    <p>Once you figure out the rule, click <button class="btn btn-primary btn-sm modal-button">Guess the rule!</button> to submit your guess. You can submit as many guesses as you want, but each incorrect guess is counted as a failed attempt.</p>
    <div class="divider"></div> 
    <h1 class="text-3xl">Example</h1>
    <p>If the rule is "There is exactly one red", then we get the following results:</p>
    <div class="card card-bordered card-compact w-full border-4 border-green-400 border-double">
      <div class="card-body text-lg h-12">
        <p>🔴🟡🔵</p>
      </div>
    </div> 
    <div class="card card-bordered card-compact w-full border-4 border-red-400 border-dashed">
      <div class="card-body text-lg h-12">
        <p>🟦</p>
      </div>
    </div> 
    <div class="card card-bordered card-compact w-full border-4 border-red-400 border-dashed">
      <div class="card-body text-lg h-12">
        <p>🟡🔴🟥🟨🟨</p>
      </div>
    </div> 
    <div class="modal-action flex-row justify-center">
      <label for="modal-rule" class="btn">Got it!</label>
    </div>
  </div>
</div>