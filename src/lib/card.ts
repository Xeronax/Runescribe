interface CardObject {
    artist: string,
    name: string,
    date: Date,
    set: string,
    set_name: string,
    rarity: string,
    image_uris: string,
    flavor_text: string | undefined,
    mana_cost: string | undefined,
    power: string | undefined,
    toughness: string | undefined,
    scryfall_uri: string | undefined,
    colors: Array<string> | undefined,
    type_line: string | undefined,
    card_faces: Array<Face> | undefined,
}

interface Face {
    mana_cost: string | undefined,
    type_line: string | undefined,
    flavor_text: string | undefined,
    oracle_text: string | undefined,
    power: string | undefined
    toughness: string | undefined,
}

function formatCardDetails(response: Array<any>) : Array<CardObject> {
    const responseJsonString : string = JSON.stringify(response); //Convert to JSON string
    const data = JSON.parse(responseJsonString);
    return data.map((card: any) => {
        return {
            artist: card.artist,
            name: card.name,
            date: new Date(card.released_at),
            set: card.set,
            set_name: card.set_name,
            rarity: card.rarity,
            images_uris: card.image_uris?.normal,
            flavor_text: card.flavor_text,
            mana_cost: card.mana_cost,
            power: card.power,
            toughness: card.toughness,
            scryfall_uri: card.scryfall_uri,
            colors: Array<string>,
            type_line: card.type_line,
            card_faces: card.card_faces
        };
    });
}

export { formatCardDetails };

export type { CardObject };