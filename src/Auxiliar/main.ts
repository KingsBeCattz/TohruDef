import {Client,Collection,Colors,Message,GuildMember,MessageComponentInteraction,Guild,User, Channel, BaseGuildTextChannel, ButtonBuilder} from 'discord.js'
import { ActionRowBuilder } from '@discordjs/builders'
import axios, {AxiosRequestConfig} from 'axios'
import { QuickDB } from 'quick.db'
import { lstatSync, readdirSync } from 'fs'
import { join } from 'path'
var colors = require('colors')

export type RamTypes = 'KB' | 'MB' | 'GB'
export type CpuTimes = {
    user: number,
    nice: number,
    sys: number,
    idle: number,
    irq: number
}

export type CpuType = {
    model: string,
    speed: number,
    times: CpuTimes
}

export class Util {
    client: Client
    commands: Collection<string, any>
    slashes: Collection<string, any>
    events: Collection<string, any>
    db: QuickDB
    constructor(client, commands, slashes, db, events){
        this.client = client
        this.commands = commands
        this.slashes = slashes
        this.events = events
        this.db = db
    }
    public cpu(decimals: number = 2){
        let result; 
        const cpus = require('os').cpus(); 
        const avgs = cpus.map((cpu: CpuType) => { 
            const total = Object.values<any>(cpu.times).reduce((a, b) => a + b); 
            const nonIdle = total - cpu.times.idle;
            return nonIdle / total
        }); 
        result = avgs.reduce((a: number, b: number) => a + b) / cpus.length
        return result.toFixed(decimals)
    }

    public ram(decimals: number = 2, type: RamTypes = 'MB'){
        let result = (process.memoryUsage().rss / 1024)
        if(type === 'MB') result = result / 1024
        if(type === 'GB') result = result / 1024 / 1024
        return result.toFixed(decimals)+type
    }
    public allMembersCount(): number {
        return this.client.guilds.cache.map((g) => g.memberCount || 0).reduce((x, y) => x + y, 0)
    }
    public random(min: number, max: number, decimals: boolean = false, trunc: number = 0): number {
        if(decimals === true){
            if(trunc <= 0){
                return Number((Math.random() * (max - min) + min).toFixed(0))
            } else {
                return Number((Math.random() * (max - min) + min).toFixed(trunc))
            }
        } else {
            return Math.floor(Math.random() * (max - min)) + min
        }
    }
    public randomString(length: number, caps: boolean = true, lowercase: boolean = true, numbers: boolean = true, dots: boolean = false, symbols: boolean = false): string {
        let characters = ''
        if(caps) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        if(lowercase) characters += 'abcdefghijklmnopqrstuvwxyz'
        if(numbers) characters += '0123456789'
        if(dots) characters +=  '.'
        if(symbols) characters +=  `!"#$%&/()=?¡¿?*+~[]{},;:-_<>`
        let result = ''
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result
    }
    public randomOfArray(array: any[], length: number = 1): any[] {
        let output;
        if(array.length < length) {
            output = array
        } else {
            let w3: any[] = []
            let j = 0
            while(j < length) {
            const random = Math.floor(Math.random() * array.length)
            if(w3.includes(array[random]) === true) continue;
            w3.push(array[random]);
            j++
        }
            output = w3
        }
        return output
    }
    public get<D = any>(url: string, config?: AxiosRequestConfig<D>): any {
        if(!config){
            return axios.get(url)
        } else {
            return axios.get(url, config)
        }
    }
    public format(string: string): string {
		string = string.replace(/[^a-z]/gi, '');
		return string[0].toUpperCase() + string.slice(1);
    }
    public ResolveColor(color: string | number): number {
        if(isNaN(Number(color))){
            if((color as string).toLowerCase() === 'random'){
                const a = Object.values(Colors).sort((a, b) => b - a)
                return this.random(a[a.length - 1], a[0])
            } else {
                return Colors[this.format((color as string).toLowerCase())]
            }
        } else {
            return (color as number)
        }
    }
    public async getMember(guild: Guild, id: string): Promise<GuildMember | null> {
        let member = id?.replace(/[^0-9]/g, '')?.replace(/ /g, '')
        if (!member) return null;
        let m;
        m = guild?.members.cache.get(member)
        if(!m) m = await guild?.members.fetch(member).catch(e=>null)
        return m
    }
    public async getUser(id: string): Promise<User | null> {
        let user = id?.replace(/[^0-9]/g, '')?.replace(/ /g, '')
        if (!user) return null;
        let m;
        m = this.client.users.cache.get(user)
        if(!m) m = await this.client.users.fetch(user).catch(e=>null)
        return m
    }
    public async getGuild(id: string): Promise<Guild | null> {
        let guild = id?.replace(/[^0-9]/g, '')?.replace(/ /g, '')
        if (!guild) return null;
        let m;
        m = this.client.guilds.cache.get(guild)
        if(!m) m = await this.client.guilds.fetch(guild).catch(e=>null)
        return m
    }
    public async getChannel(id: string): Promise<Channel | null> {
        let channel = id?.replace(/[^0-9]/g, '')?.replace(/ /g, '')
        if (!channel) return null;
        let m;
        m = this.client.channels.cache.get(channel)
        if(!m) m = await this.client.channels.fetch(channel).catch(e=>null)
        return m
    }
    public async getMessage(channel: BaseGuildTextChannel, id: string): Promise<Message<boolean> | null> {
        let message = id?.replace(/[^0-9]/g, '')?.replace(/ /g, '')
        if (!message) return null;
        let m;
        m = channel.messages.cache.get(message)
        if(!m) m = await channel.messages.fetch(message).catch(e=>null)
        return m
    }
    public disableComponents(components: any[]): ActionRowBuilder<ButtonBuilder>[] {
        for (let x = 0; x < components?.length; x++) {
            for (let y = 0; y < components[x].components.length; y++) {
                components[x].components[y].data.disabled = true;
            }
        }

        return components;
    }
    public eventsLoader(path){
        let mdir = process.cwd()
        let modules = readdirSync(join(mdir, path))
        for(const file of modules){
            let stat = lstatSync(join(mdir, path, file))
            if(stat.isDirectory()) {this.eventsLoader(join(path, file)); continue;}
            delete require.cache[require(join(mdir, path, file))]
            let event = require(join(mdir, path, file))
            if(!event?.name) { console.log('|-----------------------------------|\n' + `| ` + `Error Loading!` + `\n| File: ${join(path, file)}`); continue};
            this.events.set(event.name, event.exec)
            this.client.on(event.name, event.exec)
            console.log('|-----------------------------------|\n' + `| ` + `Event Loaded!` + `\n| Name: ${event.name} \n| From: ${join(path, file)}`)
        }
        console.log('|-----------------------------------|')
        return this.events
    }
}