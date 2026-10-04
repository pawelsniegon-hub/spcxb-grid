export async function onRequest() {

    try {

        const url =
            "https://open-api.bingx.com/openApi/spot/v2/market/kline" +
            "?symbol=SPCXB-USDT" +
            "&interval=1h" +
            "&limit=720";


        const response = await fetch(url, {
            method: "GET"
        });


        const text = await response.text();


        if (!response.ok) {

            return new Response(

                JSON.stringify({
                    error: "BingX HTTP " + response.status,
                    response: text
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


        let result;


        try {

            result = JSON.parse(text);

        } catch (error) {

            return new Response(

                JSON.stringify({
                    error:
                        "BingX zwrócił nieprawidłowy JSON",
                    response:
                        text
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
        BingX musi zwrócić code = 0
        */

        if (result.code !== 0) {

            return new Response(

                JSON.stringify({

                    error:
                        "BingX zwrócił błąd",

                    code:
                        result.code,

                    msg:
                        result.msg,

                    data:
                        result.data

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
        Sprawdzamy dane
        */

        if (
            !Array.isArray(result.data)
        ) {

            return new Response(

                JSON.stringify({

                    error:
                        "BingX nie zwrócił tablicy świec",

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
        Zamiana świec BingX
        na prosty format dla naszego wykresu.
        
        BingX:
        [czas, open, high, low, close, volume...]

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
                    Number.isFinite(candle.time) &&
                    Number.isFinite(candle.close)
                );


        /*
        Sortujemy od najstarszej
        do najnowszej świecy.
        */

        candles.sort(
            (a, b) =>
                a.time - b.time
        );


        /*
        Zwracamy dane.
        */

        return new Response(

            JSON.stringify(candles),

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
                    "Błąd połączenia z BingX",

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
