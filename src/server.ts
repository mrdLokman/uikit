import express from "express"
import {getPayloadClient} from "./get-payload";
import {nextApp, nextHandler} from "./next-utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import {appRouter} from "./trpc";
import {inferAsyncReturnType} from "@trpc/server";
import bodyParser from "body-parser";
import {IncomingMessage} from "http";
import {stripeWebHookHandler} from "./web-hooks";
import {nextBuild} from "next/dist/cli/next-build";
import path from "path";
const app = express();
const PORT = Number(process.env.POST) || 3000


const createContext = ({req, res}: trpcExpress.CreateExpressContextOptions)=>({
    req, res
});

export type ExpressContext = inferAsyncReturnType<typeof createContext>;

export type WebhookRequest = IncomingMessage & {rawBody: Buffer}
const start = async ()=>{

    const webHookMiddleware = bodyParser.json({
        verify: (req: WebhookRequest, _, buffer)=> {
            req.rawBody = buffer;
        }
    })

    app.post('/api/webhook/stripe', webHookMiddleware, stripeWebHookHandler);

    const payload = await getPayloadClient({
        initOptions: {
            express: app,
            onInit: async (cms)=>{
                cms.logger.info(`Admin URL ${cms.getAdminURL()}`)
            },
        },
    })

    if(process.env.NEXT_BUILD){
        app.listen(PORT, async ()=>{
            payload.logger.info("NextJS is building for production")
            await nextBuild(path.join(__dirname, '../'));
            process.exit()
        })
        return
    }

    app.use('/api/trpc', trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext
    }))

    app.use((req, res) => nextHandler(req, res))
    nextApp.prepare().then(()=>{
        payload.logger.info('NextJS started')
    })

    app.listen(PORT, async ()=>{
        payload.logger.info(`NextJS App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`)
    })
}

start()