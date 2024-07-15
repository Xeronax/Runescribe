import axios, {type AxiosResponse} from "axios";

const scryfallAPI : string = 'https://api.scryfall.com';
const queue : Array<Request> = []

interface Request {
    url: string,
    query: string | undefined,
    currentPage: number | undefined,
    resolve: Function,
    reject: Function
}

async function requestCards(input: string | undefined, page: number = 1) : Promise<Array<Object>> {
    return new Promise((resolve, reject) => {
        const req: Request = {
            query: input,
            currentPage: page,
            url: 'cards/search',
            resolve: resolve,
            reject: reject
        }
        queue.push(req);
    });
}

async function requestSets(): Promise<any> {
    return new Promise((resolve, reject) => {
        const req: Request = {
            query: undefined,
            currentPage: undefined,
            url: 'sets',
            resolve: resolve,
            reject: reject
        }
        queue.push(req);
    });
}

setInterval( async () : Promise<any> => {
    const request : Request | undefined = queue.shift();
    if(request) {
        let currentPage: number = request.currentPage ?? 1;
        const allData : Array<any> = [];
        try {
            const response : AxiosResponse = await axios.get(`${scryfallAPI}/${request.url}`, {
                params: {
                    q: request.query,
                    page: currentPage
                }
            });
            if(response.status != 200) {
                request.reject();
            } else {
                allData.push(...response.data.data);
                if(response.data.has_more) {
                    currentPage++;
                    // Make recursive API requests for the next pages
                    allData.push(...(await requestCards(request.query, currentPage)));
                }
                request.resolve(allData);
            }
        } catch (error) {
            console.log(error)
            request.reject(error);
        }
    }
}, 100);

export { requestCards, requestSets };