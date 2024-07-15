<script lang="ts">
    import { createEventDispatcher } from "svelte";

    let textBox: HTMLInputElement | null;
    const dispatch = createEventDispatcher();
    async function search() {
        if(!textBox) return;
        if(textBox.value.length == 0) return;
        console.log("Starting search");
        dispatch('search', { query: textBox.value });
    }

</script>

<form id="searchBarContainer" on:submit={search}>
    <input id="textInput" form="searchBarContainer" bind:this={textBox} type="search"/>
</form>

<style>
    form {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        max-height: 10%;
    }
    #textInput {
        width: 80%;
        height: 100%
    }
</style>