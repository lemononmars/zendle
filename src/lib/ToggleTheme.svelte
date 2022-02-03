<script lang="ts">
  import { theme } from '../routes/store'
  import { themeChange } from 'theme-change'
  import { onMount } from 'svelte'

  onMount(() => {
    themeChange($theme)
  })

  const toggleTheme = () => {
    $theme = $theme === 'dark' ? 'emerald' : 'dark'
    themeChange($theme)
  }

  let checked = $theme === 'dark'
  $: themeText = $theme === 'dark'? 'Dark mode: on' : 'Dark mode: off'
</script>

<div>
<span class="flex flex-row items-center p-4">
  {themeText}
  <input type="checkbox" bind:checked on:click={toggleTheme} class="toggle">   
</span>
</div>