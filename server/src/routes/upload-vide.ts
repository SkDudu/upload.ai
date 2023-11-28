import { FastifyInstance } from "fastify";
import { fastifyMultipart } from '@fastify/multipart'
import { prisma } from "../lib/prisma";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import path from "node:path";

const pump = promisify(pipeline)

export async function uploadVideo(app: FastifyInstance){
    app.register(fastifyMultipart, {
        limits: {
            fileSize: 1_048_576 * 25, //25mb
        }
    })

    app.post('/videos', async (request, reply) => {
        const data = await request.file()
        if(!data){
            return reply.status(400).send({error: 'Missing file input.'})
        }

        const extension = path.extname(data.filename)

        if(extension !== '.mp3'){
            return reply.status(400).send({error: 'Invalid input type. Please upload a MP3.'})
        }

        const fileBaseName = path.basename(data.filename, extension)

        const fileuploadName = `${fileBaseName}-${randomUUID()}${extension}`

        const uploadDestination = path.resolve(__dirname, '../../tmp', fileuploadName)

        await pump(data.file, fs.createWriteStream(uploadDestination))

        const video = await prisma.video.create({
            data: {
                name: data.filename,
                path: uploadDestination,
            }
        })

        return {video}
    })
}