import {Client,Collection} from 'discord.js'
import {Util} from './Auxiliar/main'
import {Config} from './config'
import { Database } from "midb";

const db = new Database({
    path: './database',
    tables: ['main']
})

export const client = new Client({
    intents: 8
})

let commands: Collection<string, any> = new Collection()
let slashes: Collection<string, any> = new Collection()

export const util = new Util(client, commands, slashes, db)
export const config = new Config(client, commands, slashes)