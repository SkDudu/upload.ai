import {fastify} from "fastify"
import {fastifyCors} from '@fastify/cors'

import { getAllPrompts } from "./routes/get-all-prompts"
import { uploadVideo } from "./routes/upload-vide"
import { createTranscriptions } from "./routes/create-transcriptions"
import { generateAIComplete } from "./routes/generate-ai-completion"

const app = fastify()

app.register(fastifyCors, {
    origin:'*',
})

app.register(getAllPrompts)
app.register(uploadVideo)
app.register(createTranscriptions)
app.register(generateAIComplete)

app.listen({
    port: 3333,
}).then(() => {
    console.log('HTTP server running!')
})