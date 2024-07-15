<script lang="ts">
    import * as d3 from "d3";
    import type {Plot} from "$lib/graphData";
    import type {ScaleContinuousNumeric, ScaleLinear, ScaleTime} from "d3";
    import {beforeUpdate} from "svelte";

    export let margin: { left: number, right: number, top: number, bottom: number };
    export let width: number, height: number;

    let x: ScaleTime<number, number, never> | ScaleLinear<number, number, never>;
    let y: ScaleTime<number, number, never> | ScaleLinear<number, number, never>;
    let xExtent: Array<any>, yExtent: Array<any>;
    let xAxis: SVGGElement, yAxis: SVGGElement;

    export function updateAxis(): void {
        console.log(`${width} x ${height}`);
        if(!xAxis || !yAxis) return;
        d3.select(xAxis)
            .transition()
            .attr("transform", `translate(0,${height - margin.bottom})`);
        d3.select(yAxis)
            .transition()
            .attr("transform", `translate(${margin.left},0)`)
    }

    export async function createScales(plot: Plot): Promise<{
        x: ScaleTime<number, number, never> | ScaleLinear<number, number, never>,
        y: ScaleTime<number, number, never> | ScaleLinear<number, number, never>
    }>
    {
        xExtent = d3.extent(plot.points, (p) => p.x);
        yExtent = d3.extent(plot.points, (p) => p.y);
        if(!xExtent[0] || !xExtent[1] || !yExtent[0] || !yExtent[1]) throw new Error("Scale Error: Extents undefined.");

        switch(plot.xScale) {
            case "date":
                const nextYear: number = new Date(Date.now()).getFullYear() + 1;
                const max = new Date(`${nextYear}-01-01`);
                x = d3.scaleUtc()
                    .domain([new Date("1993-01-01"), max])
                    .range([margin.left, width - margin.right]);
        }
        switch(plot.yScale) {
            case "count":
                const max = yExtent[1] + (10 - yExtent[1] % 10);
                y = d3.scaleLinear()
                    .domain([0, max])
                    .range([height - margin.bottom, margin.top]);
        }
        if(!x || !y) throw new Error("Scale Error: Scales undefined.")

        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        d3.select(yAxis)
            .transition()
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y)
                .tickSize(3)
                .tickSizeInner(-innerWidth) //Grid lines
                .ticks(20));
        d3.select(xAxis)
            .transition()
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x)
                .tickSize(3)
                .tickSizeInner(-innerHeight) //Grid lines
                .ticks(20));
        return new Promise((resolve, reject) => {
            resolve({ x, y });
        });
    }
</script>

<g bind:this={xAxis} transform="translate(0, {height - margin.bottom})"></g>
<g bind:this={yAxis} transform="translate({margin.left}, 0)"></g>
