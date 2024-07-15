import type {CardObject} from "$lib/card";
import {type Writable, writable} from "svelte/store";
const currentPlot: Writable<Plot | undefined> = writable(undefined);

type DataPoint = {
    id: number,
    x: Date | number,
    y: number,
    set: string,
    cards: Array<CardObject>,
}

type Plot = {
    xScale: string,
    yScale: string,
    points: Array<DataPoint>,
    query: string,
    scope: string,
    type: string
}

function createPlot(
    query: string,
    data: Array<CardObject>,
    xScaleType: string = "date",
    yScaleType: string = "count",
    scope: string = "set",
    type: string = "scatter"
): void {
    let points: Array<DataPoint> = filterData(data);
    if (points.length == 0) {
        currentPlot.set(undefined);
        throw new Error("No results found.")
    } else {
        currentPlot.set({
            query: query,
            points: points,
            xScale: xScaleType,
            yScale: yScaleType,
            scope: scope,
            type: type
        })
    }
}

function filterData(data: Array<CardObject>): Array<DataPoint> {
    const id: number = Math.random() * 10000;
    return data.reduce((points: Array<DataPoint>, card: CardObject) => {
        const existingPoint: DataPoint | null = findOrUpdatePoint(points, card);
        if(!existingPoint) {
            const point: DataPoint = {
                id: id,
                x: card.date,
                y: 1,
                set: card.set,
                cards: [card],
            }
            points.push(point);
        }
        return points;
    }, []);
}

function findOrUpdatePoint(dataChunk: Array<DataPoint>, card: CardObject): DataPoint | null {
    for (let point of dataChunk) {
        if(point.set === card.set) {
            point.y++;
            point.cards.push(card);
            return point;
        }
    }
    return null;
}

export { createPlot, findOrUpdatePoint, filterData }
export { type DataPoint, type Plot }
export { currentPlot }