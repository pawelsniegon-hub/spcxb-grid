export async function onRequest() {

    try {

        const url =
            "https://open-api.bingx.com/openApi/spot/v2/market/kline" +
            "?symbol=SPCXB-USDT" +
            "&interval=1h" +
            "&limit=100";


        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });


        const text = await response.text();


        return new Response(

            JSON.stringify({

                httpStatus: response.status,

                bingxResponse: text

            }),

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

                error: error.message

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
