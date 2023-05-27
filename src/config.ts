import { Client, Collection, ColorResolvable } from 'discord.js'
import {discord} from './tokens'
import {util} from './index'

export class Config {
    client: Client
    commands: Collection<string, any>
    slashes: Collection<string, any>
    colors: {
        blushed: 16722224,
        cyan: 65535,
        cyan2: 45567,
        cyan3: 6055423,
        cyan4: 12836604,
        gray: 1841176,
        pink: 15907032,
        pink2: 13829803,
        pink3: 13859239,
        pink4: 14660059,
        purple: 5375653,
        purple2: 13333500,
        purple3: 13859307,
        red: 16711680,
        red2: 16515637,
        red3: 16517142,
        yellow: 16579584,
        yellow2: 14740224,
        rule34: 9954757
    }
    constructor(client, commands, slashes){
        this.client = client
        this.commands = commands
        this.slashes = slashes
        this.colors = {
            blushed: 16722224,
            cyan: 65535,
            cyan2: 45567,
            cyan3: 6055423,
            cyan4: 12836604,
            gray: 1841176,
            pink: 15907032,
            pink2: 13829803,
            pink3: 13859239,
            pink4: 14660059,
            purple: 5375653,
            purple2: 13333500,
            purple3: 13859307,
            red: 16711680,
            red2: 16515637,
            red3: 16517142,
            yellow: 16579584,
            yellow2: 14740224,
            rule34: 9954757
        }
    }
}