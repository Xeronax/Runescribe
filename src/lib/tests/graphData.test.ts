import type {CardObject} from "$lib/card";
import {createPlot, findOrUpdatePoint, currentPlot, type DataPoint, type Plot} from "$lib/graphData";
import * as graphDataModule from "$lib/graphData"
import {test, expect, describe, beforeEach, afterEach, vi} from "vitest";
import type {Unsubscriber} from "svelte/store";

// Data
let chunk: Array<DataPoint> = [];
const card: CardObject = {
    card_faces: undefined,
    colors: undefined,
    flavor_text: undefined,
    mana_cost: undefined,
    power: undefined,
    scryfall_uri: undefined,
    toughness: undefined,
    type_line: undefined,
    artist: "",
    set: "SNC",
    date: new Date("1999-01-01"),
    rarity: 'C',
    image_uris: "",
    name: "Inspiring Overseer",
    set_name: "Streets of New Capenna"
}

const diffCard: CardObject = structuredClone(card)
diffCard.set = "WOE";
diffCard.name = "Elvish Archivist";
diffCard.date = new Date("2023-03-17");

const setSpy = vi.spyOn(graphDataModule.currentPlot, 'set');

//Tests
describe('Graph Data Functionality Checks', () => {
    beforeEach(async () => {
        chunk.push(...[
            {
                id: 1,
                x: new Date("1999-01-01"),
                y: 0,
                cards: [],
                set: "SNC",
            }
        ]);
        currentPlot.set(undefined);
    });
    afterEach(async () => {
       chunk = [];
    })
    describe("Data Point Updates", () => {
        test("Existing Set", () => {
            expect(findOrUpdatePoint(chunk, card)).toStrictEqual({ x: new Date("1999-01-01"), y: 1, cards: [ card ], set: "SNC"});
        });
        test("Set Not Present", () => {
            expect(findOrUpdatePoint(chunk, diffCard)).toBe(null);
        });
        test("Set Present, Current Card's Set Doesn't Match", () => {
            expect(findOrUpdatePoint(chunk, diffCard)).toBe(null);
        });
    })
    describe("Plot Creation Functionality", async () => {
        let storeValue: Plot | undefined;
        const unsub: Unsubscriber = currentPlot.subscribe((value) => {
            storeValue = value;
        });
        test("Plot Creation Calls Correctly", async () => {
            createPlot(card.name, [ card ]);
            await vi.waitFor(() => {
                expect(graphDataModule.currentPlot.set).toHaveBeenCalledWith(
                    expect.objectContaining({
                        query: card.name,
                        points: expect.arrayContaining([
                            expect.objectContaining({set: "SNC", y: 1})
                        ])
                    })
                );
            })
        });
        test("Empty Plot Throws Error", () => {
            expect(() => createPlot("", [])).toThrowError();
        });

        unsub();
    });
});

