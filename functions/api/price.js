export async function onRequest() {
    try {
        const url =
            "https://open-api.bingx.com/openApi/spot/v1/ticker/24hr?symbol=SPCXB-USDT";

        const response = await fetch(url);

        if (!response.ok) {
            return new Response(
                JSON.stringify({
                    error: "BingX HTTP " + response.status
                }),
                {
                    status: 502,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        const data = await response.json();

        if (
            data.code !== 0 ||
            !data.data ||
            !data.data.length
        ) {
            return new Response(
                JSON.stringify({
                    error: "BingX nie zwrócił danych",
                    bingx: data
                }),
                {
                    status: 502,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        const ticker = data.data[0];

        return new Response(
            JSON.stringify({
                symbol: ticker.symbol,
                price: Number(ticker.lastPrice),
                change24h: Number(ticker.priceChangePercent),
                time: Date.now()
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-store"
                }
            }
        );

    } catch (error) {

        return new Response(
            JSON.stringify({
                error: "Nie można połączyć się z BingX"
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
}
