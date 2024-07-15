<script lang="ts">
    import * as d3 from "d3";
    import type {DataPoint, Plot} from "$lib/graphData";
    import {createEventDispatcher, type EventDispatcher} from "svelte";
    import type {ScaleLinear, ScaleTime} from "d3";

    export let graphSvg: SVGSVGElement;
    let dispatch: EventDispatcher<any> = createEventDispatcher();
    const circleRadius: number = 5;
    const expandedRadius: number = 10;

    export function createPoints(
        plot: Plot,
        scales: {
            x: ScaleTime<number, number> | ScaleLinear<number, number>,
            y: ScaleTime<number, number> | ScaleLinear<number, number>
        }
    ): void {
        d3.select(graphSvg).selectAll("circle")
            .transition()
            .attr('r', 0)
            .remove();

        d3.select(graphSvg).selectAll<SVGCircleElement, DataPoint>("circle")
            .data(plot.points, d => d.id)
            .enter()
            .append("circle")
            .attr('r', 0)
            .attr('fill', 'blue')
            .attr('cx', d => scales.x(d.x))
            .attr('cy', d => scales.y(d.y))
            .on('click', function (_, d) {
                //Unselect animation on all other circles
                d3.selectAll("circle").filter((circle) => circle != this)
                    .transition()
                    .attr('stroke-width', 0)
                    .attr('layer', 0)
                d3.select(this)
                    .attr('stroke', "green")
                    .attr('stroke-width', 3)
                    .attr('layer', 1);
                dispatch('elaborate', d);
            })
            .on('mouseover', function () {
                d3.select(this)
                    .transition()
                    .attr('r', expandedRadius);
            })
            .on('mouseleave', function () {
                d3.select(this)
                    .transition()
                    .attr('r', circleRadius);
            })
            .transition()
            .attr('r', circleRadius)
            .delay(250);
    }
</script>