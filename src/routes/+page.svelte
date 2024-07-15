<script lang="ts">
    import Graph from "$lib/components/ScatterPlot.svelte"
    import SideBar from "$lib/components/SideBar.svelte"
    import {requestCards} from "$lib/scry";
    import {formatCardDetails} from "$lib/card";
    import {createPlot} from "$lib/graphData";

    let graphBox : HTMLElement | null;
    function handleSearch(event: CustomEvent) {
        const query: string = event.detail.query;
        requestCards(query).then((response) => {
            console.log(response)
            createPlot(query, formatCardDetails(response));
        }).catch((e: Error) => {
            alert(e);
        });
    }

</script>


<div id="siteHeader">
    <h1>Runescribe</h1>
</div>
<div id="container">
    <SideBar on:search={handleSearch}/>
    <div id="graphBox" bind:this={graphBox}>
        <Graph graphBox={graphBox}/>
    </div>
</div>

<style>
    h1 {
        color: darkgreen;
        margin: 0;
    }
    #graphBox {
        display: flex;
        flex-direction: column;
        width: 65vw;
        align-items: center;
        align-content: center;
        background-color: white;
    }
    #container {
        display: flex;
        flex-direction: row;
        height: 90vh;
    }
    #siteHeader {
        height: 10vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        align-content: center;
        background-color: #F0F8FF;
        box-sizing: border-box;
        z-index: 10;
        line-height: 50px;
    }
   :global(body) {
        display: flex;
        flex-direction: column;
        max-height: 100vh;
        margin: 0;
        font-family: sans-serif, "Roboto Light";
    }
</style>