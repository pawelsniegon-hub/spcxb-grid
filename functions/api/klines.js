export async function onRequest() {

    try {

        const url =
            "https://open-api.bingx.com/openApi/spot/v2/market/kline" +
            "?symbol=SPCXB-USDT" +
            "&interval=1h" +
            "&limit=720";


        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });


        if (!response.ok) {

            return new Response(

                JSON.stringify({
                    error:
                        "BingX HTTP " +
                        response.status
                }),

                {
                    status: 502,

                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }

            );

        }


        const result =
            await response.json();


        /*
        Sprawdzamy odpowiedź BingX
        */

        if (
            result.code !== 0 ||
            !Array.isArray(result.data)
        ) {

            return new Response(

                JSON.stringify({

                    error:
                        "BingX nie zwrócił poprawnej historii",

                    bingx:
                        result

                }),

                {

                    status: 502,

                    headers: {
                        "Content-Type":
                            "application/json"
                    }

                }

            );

        }


        /*
        BingX zwraca:

        [
            timestamp,
            open,
            high,
            low,
            close,
            volume,
            ...
        ]
        */


        const candles =
            result.data
                .map(candle => {

                    return {

                        time:
                            Number(candle[0]),

                        open:
                            Number(candle[1]),

                        high:
                            Number(candle[2]),

                        low:
                            Number(candle[3]),

                        close:
                            Number(candle[4])

                    };

                })
                .filter(candle =>

                    Number.isFinite(
                        candle.time
                    )

                    &&

                    Number.isFinite(
                        candle.close
                    )

                );


        /*
        BingX może zwrócić świece
        od najnowszej do najstarszej.

        My potrzebujemy odwrotnie.
        */

        candles.sort(

            (a, b) =>
                a.time - b.time

        );


        /*
        Zwracamy już czyste dane
        dla naszego wykresu.
        */

        return new Response(

            JSON.stringify(
                candles
            ),

            {

                status: 200,

                headers: {

                    "Content-Type":
                        "application/json",

                    "Cache-Control":
                        "no-store"

                }

            }

        );

    }


    catch (error) {

        return new Response(

            JSON.stringify({

                error:
                    "Nie można pobrać historii BingX",

                message:
                    error.message

            }),

            {

                status: 500,

                headers: {

                    "Content-Type":
                        "application/json"

                }

            }

        );

    }

}
