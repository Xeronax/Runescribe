<script lang="ts">
    import SearchBar from "$lib/components/SearchBar.svelte"
</script>



<div id="sidebar">
    <div id="tabs">
        <h1>Options Placeholder</h1>
    </div>
    <div id="content">
        <SearchBar on:search/>
    </div>
</div>

<style>
    h1 {
        color: crimson;
        margin: 0;
    }
    #sidebar {
        display: flex;
        flex-direction: column;
        height: auto;
        width: 35vw;
        box-shadow: 1px 0px 5px black;
        background-color: white;
        z-index: 1;
        border-right: 1px green;
    }
    #tabs {
        height: 10%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #F0F8FF;
    }
    #content {
        height: 90%;
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 100%;
     }
</style>