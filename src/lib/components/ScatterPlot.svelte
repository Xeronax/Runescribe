<script lang="ts">
    import {currentPlot} from "$lib/graphData";
    import Axes from "$lib/components/Axes.svelte";
    import DataPoints from "$lib/components/DataPoints.svelte";
    import type {DataPoint} from "$lib/graphData";
    import * as d3 from "d3";
    import {onMount} from "svelte";

    export let graphBox: HTMLElement | null;
    let axes: Axes;
    let graphSvg: SVGSVGElement;
    let dataPoints: DataPoints;
    let width : number = 640, height : number = 400;
    const margin = { top: 20, bottom: 50, right: 40, left: 40 };

    currentPlot.subscribe((plot) => {
        if(!plot) return;
        axes.createScales(plot)
            .then((scales) => {
                dataPoints.createPoints(plot, scales);
            })
            .catch((e) => {
                alert(e);
            })
    })

    onMount(() => {
        if(!graphBox) return;
        width = graphBox.offsetWidth;
        height = graphBox.offsetHeight;
    })
</script>

<svg id="graph" bind:this={graphSvg} viewBox="0 0 {width} {height}" preserveAspectRatio="xMaxyMin meet" width={width} height={height}>
    <Axes bind:this={axes} margin={margin} width={width} height={height}/>
    <DataPoints bind:this={dataPoints} graphSvg={graphSvg}/>
</svg>

<style>
    #graph {
        height: auto;
        width: 100%;
        font-size: larger;
        background-color: white;
    }
</style>