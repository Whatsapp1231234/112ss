import fs from 'fs'
import translate from '@vitalets/google-translate-api'
import moment from 'moment-timezone'
import ct from 'countries-and-timezones'
import { parsePhoneNumber } from 'libphonenumber-js'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
const { levelling } = '../lib/levelling.js'
import PhoneNumber from 'awesome-phonenumber'
import { promises } from 'fs'
import { join } from 'path'
import chalk from 'chalk'

let handler = async (m, { conn, usedPrefix, usedPrefix: _p, __dirname, text, command }) => {
let chat = global.db.data.chats[m.chat]
let user = global.db.data.users[m.sender]
let bot = global.db.data.settings[conn.user.jid] || {}

const commandsConfig = [
{ comando: (bot.restrict ? 'выкл ' : 'вкл ') + 'ограничить', descripcion: bot.restrict ? '✅ ' + 'включена' : '❌ ' + 'выключена', contexto: 'Разрешения для бота', showPrefix: true },
{ comando: (bot.antiCall ? 'выкл ' : 'вкл') + 'антизвонок', descripcion: bot.antiCall ? '✅ ' + 'включена' : '❌ ' + 'выключена', contexto: 'Избегать приема звонков в боте', showPrefix: true },
{ comando: (bot.temporal ? 'выкл ' : 'вкл ') + 'время', descripcion: bot.temporal ? '✅ ' + 'включена' : '❌ ' + 'выключена', contexto: 'Временное включение бота в группы', showPrefix: true },
{ comando: (bot.jadibotmd ? 'выкл ' : 'вкл ') + 'serbot', descripcion: bot.jadibotmd ? '✅ ' + 'включена' : '❌ ' + 'выключена', contexto: 'Разрешать или запрещать субботов на этом боте', showPrefix: true },
{ comando: (bot.antiSpam ? 'выкл ' : 'вкл ') + 'антиспам', descripcion: bot.antiSpam ? '✅ ' + 'включена' : '❌ ' + 'выключена', contexto: 'Дать предупреждение за рассылку спама', showPrefix: true },
{ comando: (bot.antiSpam2 ? 'выкл ' : 'вкл ') + 'антиспам2', descripcion: bot.antiSpam2 ? '✅ ' + 'включена' : '❌ ' + 'выключена', contexto: 'Пропустить результат последовательных команд', showPrefix: true },
{ comando: (bot.antiPrivate ? 'выкл ' : 'вкл ') + 'антиличка', descripcion: bot.antiPrivate ? '✅ ' + 'включена' : '❌ ' + 'выключена', contexto: 'Запрещает использование этого бота в частном порядке', showPrefix: true },
{ comando: (global.opts['авточтение'] ? 'выкл ' : 'вкл ') + 'авточтение', descripcion: global.opts['autoread'] ? '✅ ' + 'включена' : '❌ ' + 'выключена', contexto: 'Автоматически прочитанные сообщения', showPrefix: true },
{ comando: (global.opts['gconly'] ? 'выкл ' : 'вкл ') + 'толькогруппы', descripcion: global.opts['gconly'] ? '✅ ' + 'включена' : '❌ ' + 'выключена', contexto: 'Заставить его работать только в группах', showPrefix: true },
{ comando: (global.opts['pconly'] ? 'выкл ' : 'вкл ') + 'тольколичка', descripcion: global.opts['pconly'] ? '✅ ' + 'включена' : '❌ ' + 'выключена', contexto: 'Заставить его работать только на частных', showPrefix: true },
 
{ comando: m.isGroup ? (chat.welcome ? 'выкл ' : 'вкл ') + 'приветствие' : false, descripcion: m.isGroup ? (chat.welcome ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'Установить приветствие в группах', showPrefix: true },
{ comando: m.isGroup ? (chat.detect  ? 'выкл ' : 'вкл ') + 'detect' : false, descripcion: m.isGroup ? (chat.detect  ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'Важные уведомления в группах', showPrefix: true },
{ comando: m.isGroup ? (chat.autolevelup  ? 'выкл ' : 'вкл ') + 'autolevelup' : false, descripcion: m.isGroup ? (chat.autolevelup  ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'Автоматическое повышение уровня', showPrefix: true },
{ comando: m.isGroup ? (chat.modoadmin  ? 'выкл ' : 'вкл ') + 'modeadmin' : false, descripcion: m.isGroup ? (chat.modoadmin  ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'Только администраторы могут использовать в группе', showPrefix: true },

{ comando: m.isGroup ? (chat.stickers ? 'выкл' : 'вкл ') + 'stickers' : false, descripcion: m.isGroup ? (chat.stickers ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'Автоматические стикеры в чатах', showPrefix: true }, 
{ comando: m.isGroup ? (chat.autosticker ? 'выкл ' : 'вкл ') + 'autosticker' : false, descripcion: m.isGroup ? (chat.autosticker ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'Мультимедиа в стикеры автоматически', showPrefix: true }, 
{ comando: m.isGroup ? (chat.reaction ? 'выкл ' : 'вкл ') + 'reacciones , reaction' : false, descripcion: m.isGroup ? (chat.reaction ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'Автоматически реагировать на сообщения', showPrefix: true }, 
{ comando: m.isGroup ? (chat.audios ? 'выкл ' : 'вкл ') + 'audios' : false, descripcion: m.isGroup ? (chat.audios ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'Автоматическое воспроизведение звука в чатах', showPrefix: true }, 
{ comando: m.isGroup ? (chat.modohorny ? 'выкл ' : 'вкл ') + 'modocaliente , modehorny' : false, descripcion: m.isGroup ? (chat.modohorny ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'Команды с контентом для взрослых', showPrefix: true }, 
{ comando: m.isGroup ? (chat.antitoxic ? 'выкл ' : 'вкл ') + 'antitoxicos , antitoxic' : false, descripcion: m.isGroup ? (chat.antitoxic ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'Наказывать / удалять токсичных пользователей', showPrefix: true },
{ comando: m.isGroup ? (chat.antiver ? 'выкл ' : 'вкл ') + 'antiver , antiviewonce' : false, descripcion: m.isGroup ? (chat.antiver ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: ' Не сжимать \"одноразовые сообщения\"', showPrefix: true }, 
{ comando: m.isGroup ? (chat.delete ? 'выкл ' : 'вкл ') + 'antieliminar , antidelete' : false, descripcion: m.isGroup ? (chat.delete ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'Показывать удаленные сообщения', showPrefix: true },
{ comando: m.isGroup ? (chat.antifake ? 'выкл ' : 'вкл ') + 'antifalsos , antifake' : false, descripcion: m.isGroup ? (chat.antifake ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'Удалить поддельных/иностранных пользователей', showPrefix: true },
{ comando: m.isGroup ? (chat.antiTraba ? 'выкл ' : 'вкл ') + 'antitrabas , antilag' : false, descripcion: m.isGroup ? (chat.antiTraba ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'Отправить автоматическое сообщение в случае задержки', showPrefix: true },
{ comando: m.isGroup ? (chat.simi ? 'выкл ' : 'вкл ') + 'simi' : false, descripcion: m.isGroup ? (chat.simi ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'SimSimi ответит автоматически', showPrefix: true },
{ comando: m.isGroup ? (chat.modoia ? 'выкл ' : 'вкл ') + 'ia' : false, descripcion: m.isGroup ? (chat.modoia ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'Автоматический искусственный интеллект', showPrefix: true },

{ comando: m.isGroup ? (chat.antilink ? 'выкл ' : 'вкл ') + 'antienlace , antilink' : false, descripcion: m.isGroup ? (chat.antilink ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'Eliminar enlaces de WhatsApp', showPrefix: true },
{ comando: m.isGroup ? (chat.antilink2 ? 'выкл ' : 'вкл ') + 'antienlace2 , antilink2' : false, descripcion: m.isGroup ? (chat.antilink2 ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'Eliminar enlaces que contenga \"https\"', showPrefix: true },
{ comando: m.isGroup ? (chat.antiTiktok ? 'выкл ' : 'вкл ') + 'antitiktok , antitk' : false, descripcion: m.isGroup ? (chat.antiTiktok ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'Eliminar enlaces de TikTok', showPrefix: true },
{ comando: m.isGroup ? (chat.antiYoutube ? 'выкл ' : 'вкл ') + 'antiyoutube , antiyt' : false, descripcion: m.isGroup ? (chat.antiYoutube ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'Eliminar enlaces de YouTube', showPrefix: true },
{ comando: m.isGroup ? (chat.antiTelegram ? 'выкл ' : 'вкл ') + 'antitelegram , antitg' : false, descripcion: m.isGroup ? (chat.antiTelegram ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'Eliminar enlaces de Telegram', showPrefix: true },
{ comando: m.isGroup ? (chat.antiFacebook ? 'выкл ' : 'вкл ') + 'antifacebook , antifb' : false, descripcion: m.isGroup ? (chat.antiFacebook ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'Eliminar enlaces de Facebook', showPrefix: true },
{ comando: m.isGroup ? (chat.antiInstagram ? 'выкл ' : 'вкл ') + 'antinstagram , antig' : false, descripcion: m.isGroup ? (chat.antiInstagram ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'Eliminar enlaces de Instagram', showPrefix: true },
{ comando: m.isGroup ? (chat.antiTwitter ? 'выкл ' : 'вкл ') + 'antiX' : false, descripcion: m.isGroup ? (chat.antiTwitter ? '✅ ' + 'включена' : '❌ ' + 'выключена') : false, contexto: 'Eliminar enlaces de X (Twitter)', showPrefix: true },
]
 
try {
let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
let { exp, limit, level, role } = global.db.data.users[m.sender]
let { min, xp, max } = xpRange(level, global.multiplier)
let name = await conn.getName(m.sender)
let d = new Date(new Date + 3600000)
let locale = 'es'
let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
let week = d.toLocaleDateString(locale, { weekday: 'long' })
let date = d.toLocaleDateString(locale, {
day: 'numeric',
month: 'long',
year: 'numeric'
})
let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
day: 'numeric',
month: 'long',
year: 'numeric'
}).format(d)
let time = d.toLocaleTimeString(locale, {
hour: 'numeric',
minute: 'numeric',
second: 'numeric'
})
let _uptime = process.uptime() * 1000
let _muptime
if (process.send) {
process.send('uptime')
_muptime = await new Promise(resolve => {
process.once('message', resolve)
setTimeout(resolve, 1000)
}) * 1000
}
let { money, joincount } = global.db.data.users[m.sender]
let muptime = clockString(_muptime)
let uptime = clockString(_uptime)
let totalreg = Object.keys(global.db.data.users).length
let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
let replace = {
'%': '%',
p: _p, uptime, muptime,
me: conn.getName(conn.user.jid),
npmname: _package.name,
npmdesc: _package.description,
version: _package.version,
exp: exp - min,
maxexp: xp,
totalexp: exp,
xp4levelup: max - exp,
github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
readmore: readMore
}
text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let mentionedJid = [who]
let username = conn.getName(who)
let taguser = '@' + m.sender.split("@s.whatsapp.net")[0]
let pp = gataVidMenu
let pareja = global.db.data.users[m.sender].pasangan 
const numberToEmoji = { "0": "0️⃣", "1": "1️⃣", "2": "2️⃣", "3": "3️⃣", "4": "4️⃣", "5": "5️⃣", "6": "6️⃣", "7": "7️⃣", "8": "8️⃣", "9": "9️⃣", }
let lvl = level
let emoji = Array.from(lvl.toString()).map((digit) => numberToEmoji[digit] || "❓").join("")

let fechaMoment, formatDate, nombreLugar, ciudad = null
const phoneNumber = '+' + m.sender
const parsedPhoneNumber = parsePhoneNumber(phoneNumber)
const countryCode = parsedPhoneNumber.country
const countryData = ct.getCountry(countryCode)
const timezones = countryData.timezones
const zonaHoraria = timezones.length > 0 ? timezones[0] : 'UTC'
moment.locale(mid.idioma_code)
let lugarMoment = moment().tz(zonaHoraria)
if (lugarMoment) {
fechaMoment = lugarMoment.format('llll [(]a[)]')
formatDate = fechaMoment.charAt(0).toUpperCase() + fechaMoment.slice(1) 
nombreLugar = countryData.name
const partes = zonaHoraria.split('/')
ciudad = partes[partes.length - 1].replace(/_/g, ' ')
}else{
lugarMoment = moment().tz('America/Lima')
fechaMoment = lugarMoment.format('llll [(]a[)]')
formatDate = fechaMoment.charAt(0).toUpperCase() + fechaMoment.slice(1) 
nombreLugar = 'America'
ciudad = 'Lima'
}	
let margen = '*··················································*'
let menu = `${lenguajeGB['smsConfi2']()} *${user.genero === 0 ? '👤' : user.genero == 'Ocultado 🕶️' ? `🕶️` : user.genero == 'Mujer 🚺' ? `🚺` : user.genero == 'Hombre 🚹' ? `🚹` : '👤'} ${user.registered === true ? user.name : taguser}* ${(conn.user.jid == global.conn.user.jid ? '' : `\n*SOY SUB BOT DE: https://wa.me/${global.conn.user.jid.split`@`[0]}*`) || ''}

> *_${formatDate}_*
> \`${nombreLugar} - ${ciudad}\`

${margen}

> 🌟 *ОБЩАЯ ИНФОРМАЦИЯ* 🌟 

*❰❰ ${lenguajeGB['smsTotalUsers']()} ❱❱* 
➺ \`\`\`${Object.keys(global.db.data.users).length}\`\`\`   

*❰❰ ${lenguajeGB['smsUptime']()} ❱❱* 
➺ \`\`\`${uptime}\`\`\`

*❰❰ ${lenguajeGB['smsVersion']()} ❱❱* 
➺ \`\`\`${vs}\`\`\`

*❰❰ ${lenguajeGB['smsMode']()} ❱❱* 
➺ \`${global.opts['self'] ? `${lenguajeGB['smsModePrivate']().charAt(0).toUpperCase() + lenguajeGB['smsModePrivate']().slice(1).toLowerCase()}` : `${lenguajeGB['smsModePublic']().charAt(0).toUpperCase() + lenguajeGB['smsModePublic']().slice(1).toLowerCase()}`}\`

*❰❰ ${lenguajeGB['smsBanChats']()} ❱❱* 
➺ \`\`\`${Object.entries(global.db.data.chats).filter(chat => chat[1].isBanned).length}\`\`\`

*❰❰ ${lenguajeGB['smsBanUsers']()} ❱❱* 
➺ \`\`\`${Object.entries(global.db.data.users).filter(user => user[1].banned).length}\`\`\`

${margen}

> ✨ *ИНФОРМАЦИЯ О ПОЛЬЗОВАТЕЛЕ* ✨

*❰❰ Тип записи ❱❱*
➺ ${user.registered === true ? `_${user.registroC === true ? '🗂️ Registro Completo' : '📑 Registro Rápido'}_` : '❌ _Sin registro_'}

*❰❰ Мое состояние ❱❱*
➺ ${typeof user.miestado !== 'string' ? '❌ *Establecer usando:* _' + usedPrefix + 'miestado_' : '_Me siento ' + user.miestado + '_'}

*❰❰ ${lenguajeGB['sms-ботон M6']().charAt(0).toUpperCase() + lenguajeGB['smsBotonM6']().slice(1).toLowerCase()} ❱❱*
➺ ${emoji} \`${user.exp - min}/${xp}\`

*❰❰ ${lenguajeGB['sms-сообщение Pareja']()} ❱❱*
➺ ${pareja ? `${name} 💕 ${conn.getName(pareja)}` : `🛐 ${lenguajeGB['результат отправки sms-сообщения']()}`}

*❰❰ Pasatiempo(s) ❱❱* 
➺ ${user.pasatiempo === 0 ? '*Sin Registro*' : user.pasatiempo + '\n'}

${margen}

> 💫 *ИНФОРМАЦИЯ* 💫\n
${generateCommand(commandsInfo, usedPrefix)}

${margen}

> 💻 *КОМАНДЫ-ВСПОМОГАТЕЛЬНЫЙ БОТ*\n
${generateCommand(commandsJadiBot, usedPrefix)}

${margen}

> 🆘 *СООБЩАТЬ О КОМАНДАХ* 🆘\n
${generateCommand(commandsReport, usedPrefix)}

${margen}

> 🪅 *ВРЕМЕННЫЙ ПИЗДЮК* 🪅\n
${generateCommand(commandsLink, usedPrefix)}

${margen}

> 🎡 *JUEGOS* 🎡\n
${generateCommand(commandsGames, usedPrefix)}

${margen}

> ✨ *IA* ✨\n
${generateCommand(commandsAI, usedPrefix)}

${margen}

> ⚙️ *AJUSTES* ⚙️
${m.isGroup ? `_✅ ➤ Activado_
_❌ ➤ Desactivado_` : `Para ver la configuración completa sólo use: *${usedPrefix}вкл* o *${usedPrefix}выкл*`}\n
${generateCommand(commandsConfig, usedPrefix).replace(/≡/g, '𖡡')}

${margen}

> 🧾 *AJUSTES/INFO - GRUPO* 🧾

✓ _${usedPrefix}configuracion_
✓ _${usedPrefix}settings_
✓ _${usedPrefix}vergrupo_

> 🪄 *DESCARGAS* 🪄

✓ _${usedPrefix}imagen | image *texto*_
✓ _${usedPrefix}pinterest | dlpinterest *texto*_
✓ _${usedPrefix}wallpaper|wp *texto*_
✓ _${usedPrefix}play | play2 *texto o link*_
✓ _${usedPrefix}play.1 *texto o link*_
✓ _${usedPrefix}play.2 *texto o link*_ 
✓ _${usedPrefix}ytmp3 | yta *link*_
✓ _${usedPrefix}ytmp4 | ytv *link*_
✓ _${usedPrefix}pdocaudio | ytadoc *link*_
✓ _${usedPrefix}pdocvieo | ytvdoc *link*_
✓ _${usedPrefix}tw |twdl | twitter *link*_
✓ _${usedPrefix}facebook | fb *link*_
✓ _${usedPrefix}instagram *link video o imagen*_
✓ _${usedPrefix}verig | igstalk *usuario(a)*_
✓ _${usedPrefix}ighistoria | igstory *usuario(a)*_
✓ _${usedPrefix}tiktok *link*_
✓ _${usedPrefix}tiktokimagen | ttimagen *link*_
✓ _${usedPrefix}tiktokfoto | tiktokphoto *usuario(a)*_
✓ _${usedPrefix}vertiktok | tiktokstalk *usuario(a)*_
✓ _${usedPrefix}mediafire | dlmediafire *link*_
✓ _${usedPrefix}clonarepo | gitclone *link*_
✓ _${usedPrefix}clima *país ciudad*_
✓ _${usedPrefix}consejo_
✓ _${usedPrefix}morse codificar *texto*_
✓ _${usedPrefix}morse decodificar *morse*_
✓ _${usedPrefix}fraseromantica_
✓ _${usedPrefix}historia_
✓ _${usedPrefix}drive | dldrive *link*_
> 👤 *CHAT ANONIMO* 👤

✓ _${usedPrefix}chatanonimo | anonimochat_
✓ _${usedPrefix}anonimoch_
✓ _${usedPrefix}start_
✓ _${usedPrefix}next_
✓ _${usedPrefix}leave_

> 🌐 *COMANDOS PARA GRUPOS* 🌐

✓ _${usedPrefix}add *numero*_
✓ _${usedPrefix}mute | unmute *@tag*_
✓ _${usedPrefix}sacar | ban | kick  *@tag*_
✓ _${usedPrefix}grupo *abrir o cerrar*_
✓ _${usedPrefix}group *open o close*_
✓ _${usedPrefix}daradmin | promote *@tag*_
✓ _${usedPrefix}quitar | demote *@tag*_
✓ _${usedPrefix}banchat_
✓ _${usedPrefix}unbanchat_
✓ _${usedPrefix}banuser *@tag*_
✓ _${usedPrefix}unbanuser *@tag*_
✓ _${usedPrefix}admins *texto*_
✓ _${usedPrefix}invocar *texto*_
✓ _${usedPrefix}tagall *texto*_
✓ _${usedPrefix}hidetag *texto*_
✓ _${usedPrefix}infogrupo | infogroup_
✓ _${usedPrefix}grupotiempo | grouptime *Cantidad*_
✓ _${usedPrefix}advertencia *@tag*_
✓ _${usedPrefix}deladvertencia *@tag*_
✓ _${usedPrefix}delwarn *@tag*_
✓ _${usedPrefix}crearvoto | startvoto *texto*_
✓ _${usedPrefix}sivotar | upvote_
✓ _${usedPrefix}novotar | devote_
✓ _${usedPrefix}vervotos | cekvoto_
✓ _${usedPrefix}delvoto | deletevoto_
✓ _${usedPrefix}enlace | link_
✓ _${usedPrefix}newnombre | nuevonombre *texto*_
✓ _${usedPrefix}newdesc | descripcion *texto*_
✓ _${usedPrefix}setwelcome | bienvenida *texto*_
✓ _${usedPrefix}setbye | despedida *texto*_
✓ _${usedPrefix}nuevoenlace | resetlink_
✓ _${usedPrefix}on_
✓ _${usedPrefix}выкл_

> 💞 *PAREJAS* 💞

✓ _${usedPrefix}listaparejas | listship_
✓ _${usedPrefix}mipareja | mylove_
✓ _${usedPrefix}pareja | couple *@tag*_
✓ _${usedPrefix}aceptar | accept *@tag*_
✓ _${usedPrefix}rechazar | decline *@tag*_
✓ _${usedPrefix}terminar | finish *@tag*_

> 📦 *VOTACIONES EN GRUPOS* 📦

✓ _${usedPrefix}crearvoto | startvoto *texto*_
✓ _${usedPrefix}sivotar | upvote_
✓ _${usedPrefix}novotar | devote_
✓ _${usedPrefix}vervotos | cekvoto_
✓ _${usedPrefix}delvoto | deletevoto_

> 🔞 *CONTENIDO* 🔞

✓ _${usedPrefix}hornymenu_

> 🔁 *CONVERTIDORES* 🔁

✓ _${usedPrefix}toimg | img | jpg *sticker*_
✓ _${usedPrefix}toanime | jadianime *foto*_
✓ _${usedPrefix}tomp3 | mp3 *video o nota de voz*_
✓ _${usedPrefix}tovn | vn *video o audio*_
✓ _${usedPrefix}tovideo *audio*_
✓ _${usedPrefix}tourl *video, imagen*_
✓ _${usedPrefix}toenlace  *video, imagen o audio*_
✓ _${usedPrefix}tts es *texto*_

> 🔆 *LOGOS* 🔆

✓ _${usedPrefix}logos *efecto texto*_
✓ _${usedPrefix}menulogos2_

> 💥 *EFECTOS* 💥

✓ _${usedPrefix}simpcard *@tag*_
✓ _${usedPrefix}hornycard *@tag*_
✓ _${usedPrefix}lolice *@tag*_
✓ _${usedPrefix}ytcomment *texto*_
✓ _${usedPrefix}itssostupid_
✓ _${usedPrefix}pixelar_
✓ _${usedPrefix}blur_

> 🍭 *RANDOM/ANIME* 🍭

✓ _${usedPrefix}chica_
✓ _${usedPrefix}chico_
✓ _${usedPrefix}cristianoronaldo_
✓ _${usedPrefix}messi_
✓ _${usedPrefix}meme_
✓ _${usedPrefix}meme2_
✓ _${usedPrefix}itzy_
✓ _${usedPrefix}blackpink_
✓ _${usedPrefix}kpop *blackpink, o exo, o bts*_
✓ _${usedPrefix}lolivid_
✓ _${usedPrefix}loli_
✓ _${usedPrefix}navidad_
✓ _${usedPrefix}ppcouple_
✓ _${usedPrefix}neko_
✓ _${usedPrefix}waifu_
✓ _${usedPrefix}akira_
✓ _${usedPrefix}akiyama_
✓ _${usedPrefix}anna_
✓ _${usedPrefix}asuna_
✓ _${usedPrefix}ayuzawa_
✓ _${usedPrefix}boruto_
✓ _${usedPrefix}chiho_
✓ _${usedPrefix}chitoge_
✓ _${usedPrefix}deidara_
✓ _${usedPrefix}erza_
✓ _${usedPrefix}elaina_
✓ _${usedPrefix}eba_
✓ _${usedPrefix}emilia_
✓ _${usedPrefix}hestia_
✓ _${usedPrefix}hinata_
✓ _${usedPrefix}inori_
✓ _${usedPrefix}isuzu_
✓ _${usedPrefix}itachi_
✓ _${usedPrefix}itori_
✓ _${usedPrefix}kaga_
✓ _${usedPrefix}kagura_
✓ _${usedPrefix}kaori_
✓ _${usedPrefix}keneki_
✓ _${usedPrefix}kotori_
✓ _${usedPrefix}kurumi_
✓ _${usedPrefix}madara_
✓ _${usedPrefix}mikasa_
✓ _${usedPrefix}miku_
✓ _${usedPrefix}minato_
✓ _${usedPrefix}naruto_
✓ _${usedPrefix}nezuko_
✓ _${usedPrefix}sagiri_
✓ _${usedPrefix}sasuke_
✓ _${usedPrefix}sakura_
✓ _${usedPrefix}cosplay_

> 🎙️ *EFECTO DE AUDIO* 🎙️

✓ _${usedPrefix}bass_
✓ _${usedPrefix}blown_
✓ _${usedPrefix}deep_
✓ _${usedPrefix}earrape_
✓ _${usedPrefix}fast_
✓ _${usedPrefix}fat_
✓ _${usedPrefix}nightcore_
✓ _${usedPrefix}reverse_
✓ _${usedPrefix}robot_
✓ _${usedPrefix}slow_
✓ _${usedPrefix}smooth_
✓ _${usedPrefix}tupai_

> 🔍 *BÚSQUEDAS* 🔍

✓ _${usedPrefix}animeinfo *texto*_
✓ _${usedPrefix}mangainfo *texto*_
✓ _${usedPrefix}google *texto*_
✓ _${usedPrefix}googlelyrics *texto*_
✓ _${usedPrefix}letra | lirik *texto*_
✓ _${usedPrefix}ytsearch | yts *texto*_
✓ _${usedPrefix}wiki | wikipedia *texto*_

> 🔊 *AUDIOS* 🔊

✓ _${usedPrefix}audios_

> 🛠️ *HERRAMIENTAS* 🛠️

✓ _${usedPrefix}afk *motivo*_
✓ _${usedPrefix}acortar *url*_
✓ _${usedPrefix}calc *operacion math*_
✓ _${usedPrefix}del *respondre a mensaje del Bot*_
✓ _${usedPrefix}qrcode *texto*_
✓ _${usedPrefix}readmore *texto1|texto2*_
✓ _${usedPrefix}spamwa *numero|texto|cantidad*_
✓ _${usedPrefix}styletext *texto*_
✓ _${usedPrefix}traducir *texto*_
✓ _${usedPrefix}morse codificar *texto*_
✓ _${usedPrefix}morse decodificar *morse*_
✓ _${usedPrefix}encuesta | poll *Motivo*_
✓ _${usedPrefix}horario_

> ⚗️ *COMANDOS RPG* ⚗️

✓ _${usedPrefix}botemporal *enlace* *cantidad*_
✓ _${usedPrefix}addbot *enlace* *cantidad*_
✓ _${usedPrefix}pase premium_
✓ _${usedPrefix}pass premium_
✓ _${usedPrefix}listapremium | listprem_
✓ _${usedPrefix}transfer *tipo cantidad @tag*_
✓ _${usedPrefix}dar *tipo cantidad @tag*_
✓ _${usedPrefix}enviar *tipo cantidad @tag*_
✓ _${usedPrefix}balance_
✓ _${usedPrefix}cartera | wallet_
✓ _${usedPrefix}experiencia | exp_
✓ _${usedPrefix}top | lb | leaderboard_
✓ _${usedPrefix}nivel | level | lvl_
✓ _${usedPrefix}rol | rango_
✓ _${usedPrefix}inventario | inventory_
✓ _${usedPrefix}aventura | adventure_
✓ _${usedPrefix}caza | cazar | hunt_
✓ _${usedPrefix}pescar | fishing_
✓ _${usedPrefix}animales_
✓ _${usedPrefix}alimentos_
✓ _${usedPrefix}curar | heal_
✓ _${usedPrefix}buy_
✓ _${usedPrefix}sell_
✓ _${usedPrefix}verificar | registrar_
✓ _${usedPrefix}perfil | profile_
✓ _${usedPrefix}myns_
✓ _${usedPrefix}unreg *numero de serie*_
✓ _${usedPrefix}minardiamantes | minargemas_
✓ _${usedPrefix}minargatacoins | minarcoins_
✓ _${usedPrefix}minarexperiencia | minarexp_
✓ _${usedPrefix}minar *:* minar2 *:* minar3_
✓ _${usedPrefix}rob | robar 
✓ _${usedPrefix}crime
✓ _${usedPrefix}reclamar | regalo | claim_
✓ _${usedPrefix}cadahora | hourly_
✓ _${usedPrefix}cadasemana | semanal | weekly_
✓ _${usedPrefix}cadames | mes | monthly_
✓ _${usedPrefix}cofre | abrircofre | cвыклer_
✓ _${usedPrefix}trabajar | work_

> 🌟 *RPG Fnatasy* 🌟

✓ _${usedPrefix}fantasy | fy_
✓ _c_
✓ _${usedPrefix}fyguia | fyguide_
✓ _${usedPrefix}fantasyinfo | fyinfo_
✓ _${usedPrefix}fyagregar | fyadd_
✓ _${usedPrefix}fycambiar | fychange_
✓ _${usedPrefix}fylista | fyl_
✓ _${usedPrefix}fantasymy | fymy_
✓ _${usedPrefix}fyentregar | fytransfer_

> 🏆 *TOP en RPG Fnatasy* 🏆

✓ _${usedPrefix}fytendencia | fyranking_

> 🏆 *TOP en GATABOT* 🏆

✓ _${usedPrefix}top | lb | leaderboard_

> 🎭 *FILTROS EN STICKERS* 🎭

✓ _${usedPrefix}sticker | s *imagen o video*_
✓ _${usedPrefix}sticker | s *url de tipo jpg*_
✓ _${usedPrefix}emojimix *😺+😆*_
✓ _${usedPrefix}scircle | círculo *imagen*_
✓ _${usedPrefix}semoji | emoji *tipo emoji*_
✓ _${usedPrefix}attp *texto*_
✓ _${usedPrefix}attp2 *texto*_
✓ _${usedPrefix}ttp *texto*_
✓ _${usedPrefix}ttp2 *texto*_
✓ _${usedPrefix}ttp3 *texto*_
✓ _${usedPrefix}ttp4 *texto*_
✓ _${usedPrefix}ttp5 *texto*_
✓ _${usedPrefix}ttp6 *texto*_
✓ _${usedPrefix}dado_
✓ _${usedPrefix}stickermarker *efecto : responder a imagen*_
✓ _${usedPrefix}stickerfilter *efecto : responder a imagen*_
✓ _${usedPrefix}cs *:* cs2_

> 😼 *MODIFICAR STICKERS* 😼

✓ _${usedPrefix}wm *packname|author*_
✓ _${usedPrefix}wm *texto1|texto2*_

> 👻 *STICKERS DINÁMICOS* 👻

✓ _${usedPrefix}palmaditas | pat *@tag*_
✓ _${usedPrefix}bofetada | slap *@tag*_
✓ _${usedPrefix}golpear *@tag*_
✓ _${usedPrefix}besar | kiss *@tag*_
✓ _${usedPrefix}alimentar | food *@tag*_

> 💎 *PARA MI CREADOR/A* 💎

✓ _${usedPrefix}join *enlace*_
✓ _${usedPrefix}unete *enlace*_
✓ _${usedPrefix}dardiamantes *cantidad*_
✓ _${usedPrefix}darxp *cantidad*_
✓ _${usedPrefix}dargatacoins *cantidad*_
✓ _${usedPrefix}addprem | userpremium *@tag* *cantidad*_
✓ _${usedPrefix}addprem2 | userpremium2 *@tag* *cantidad*_
✓ _${usedPrefix}addprem3 | userpremium3 *@tag* *cantidad*_
✓ _${usedPrefix}addprem4 | userpremium4 *@tag* *cantidad*_
✓ _${usedPrefix}idioma | language_
✓ _${usedPrefix}cajafuerte_
✓ _${usedPrefix}comunicar | broadcastall | bc *texto*_
✓ _${usedPrefix}broadcastchats | bcc *texto*_
✓ _${usedPrefix}comunicarpv *texto*_
✓ _${usedPrefix}broadcastgc *texto*_
✓ _${usedPrefix}comunicargrupos *texto*_
✓ _${usedPrefix}borrartmp | cleartmp_
✓ _${usedPrefix}delexp *@tag*_
✓ _${usedPrefix}delgatacoins *@tag*_
✓ _${usedPrefix}deldiamantes *@tag*_
✓ _${usedPrefix}reiniciar | restart_
✓ _${usedPrefix}ctualizar | update_
✓ _${usedPrefix}addprem | +prem *@tag*_
✓ _${usedPrefix}delprem | -prem *@tag*_
✓ _${usedPrefix}listapremium | listprem_
✓ _${usedPrefix}añadirdiamantes *@tag cantidad*_
✓ _${usedPrefix}añadirxp *@tag cantidad*_
✓ _${usedPrefix}añadirgatacoins *@tag cantidad*_
`.trim()
await conn.sendFile(m.chat, gataImg, 'lp.jpg', menu, m, fakeChannel, false, { contextInfo: {mentionedJid, externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: gt, body: ' 😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗 - 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 ', previewType: 0, thumbnail: imagen4, sourceUrl: redesMenu }}})
//conn.sendFile(m.chat, gataVidMenu.getRandom(), 'gata.mp4', menu, fkontak)
} catch (e) {
await m.reply(lenguajeGB['smsMalError3']() + '\n*' + lenguajeGB.smsMensError1() + '*\n*' + usedPrefix + `${lenguajeGB.lenguaje() == 'es' ? 'reporte' : 'report'}` + '* ' + `${lenguajeGB.smsMensError2()} ` + usedPrefix + command)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)}


}

//handler.command = /^(menu|menú|memu|memú|help|info|comandos|2help|menu1.2|ayuda|commands|commandos|menucompleto|allmenu|allm|m|\?)$/i
handler.command = /^(menucompleto|allmenu|меню|\?)$/i
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
function clockString(ms) {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')}  

// Función para formatear arrays de comandos
function generateCommand(commandsArray, usedPrefix) {
const formattedCommands = commandsArray
.filter(command => {
const comandoValido = command.comando && typeof command.comando === 'function' && command.comando()
const descripcionValida = command.descripcion && typeof command.descripcion === 'function'
const contextoValido = typeof command.contexto === 'string' && command.contexto.trim() !== ''
return comandoValido || descripcionValida || contextoValido
})
.map((command, index, array) => {
const prefix = (command.showPrefix === true && ((typeof command.comando === 'function' && typeof command.comando() === 'string' && command.comando().trim() !== '') ||
(typeof command.comando === 'string' && command.comando.trim() !== ''))) ? usedPrefix : ''
let formattedCommand = ''
if (command.comando) {
if (typeof command.comando === 'function') {
const commandResult = command.comando()
if (typeof commandResult === 'string') {
formattedCommand = commandResult.trim()
}} else if (typeof command.comando === 'string') {
formattedCommand = command.comando.trim()
}}
if (formattedCommand.includes(',')) {
formattedCommand = mid.idioma_code === 'es' ? formattedCommand.split(',')[0].trim() : formattedCommand.split(',')[1].trim()
}
let formattedDescription = ''
if (command.descripcion) {
if (typeof command.descripcion === 'function') {
const descriptionResult = command.descripcion()
if (typeof descriptionResult === 'string') {
formattedDescription = descriptionResult.trim()
}} else if (typeof command.descripcion === 'string') {
formattedDescription = command.descripcion.trim()
}}
if (formattedDescription.includes('||')) {
formattedDescription = mid.idioma_code === 'es' ? formattedDescription.split('||')[0].trim() : formattedDescription.split('||')[1].trim()
}
let formattedContext = ''
if (command.contexto) {
if (typeof command.contexto === 'function') {
const contextResult = command.contexto()
if (typeof contextResult === 'string') {
formattedContext = contextResult.trim()
}} else if (typeof command.contexto === 'string' && command.contexto.trim() !== '') {
formattedContext = command.contexto.trim()
}}
let message = ''
if (formattedCommand) {
message += `✓ \`${prefix}${formattedCommand}\``
if (formattedDescription) {
message += `\n${(command.descripcion && typeof command.descripcion === 'function') ? '𖡡' : '≡'} \`\`\`${formattedDescription}\`\`\``
}
if (formattedContext) {
message += '\nⓘ _' + formattedContext + '_' + (index !== array.length - 1 ? '\n' : '')
}}
return message
})
.filter(message => message !== '')
return formattedCommands.join('\n')
}

// comando: Si hay comando en español y inglés separar por (,) máximo 2 comandos 
// descripcion: Parámetros para usar el comando. Separar por (||) máximo 2 descripciones 
// contexto: Explicación de que trata el comando
// showPrefix: Usar true para que muestre el prefijo, de lo contrario usar false
// Si algún objeto no se va usar dejar en false, menos el objeto "comando" ya que si es false no mostrará nada
const commandsInfo = [
{ comando: 'cuentasgatabot , accounts', descripcion: false, contexto: 'Cuentas oficiales', showPrefix: true },
{ comando: 'grupos , linkgc', descripcion: false, contexto: 'Grupos oficiales', showPrefix: true },
{ comando: 'donar , donate', descripcion: false, contexto: 'Apoya al proyecto donando', showPrefix: true },
{ comando: 'listagrupos , grouplist', descripcion: false, contexto: 'Grupos en donde estoy', showPrefix: true },
{ comando: 'estado , status', descripcion: false, contexto: 'Información de mí estado', showPrefix: true },
{ comando: 'infogata , infobot', descripcion: false, contexto: 'Información sobre el Bot', showPrefix: true },
{ comando: 'instalarbot , installbot', descripcion: false, contexto: 'Información y métodos de instalación', showPrefix: true },
{ comando: 'creadora , owner', descripcion: false, contexto: 'Información sobre mí Creadora', showPrefix: true },
{ comando: 'velocidad , ping', descripcion: false, contexto: 'Verifica la velocidad de este Bot', showPrefix: true },
{ comando: 'Bot', descripcion: false, contexto: 'Mensaje predeterminado del Bot', showPrefix: false },
{ comando: 'términos y condiciones , terms and conditions', descripcion: false, contexto: 'Revisa detalles al usar este Bot', showPrefix: false },
]
const commandsJadiBot = [
{ comando: 'serbot , jadibot', descripcion: false, contexto: 'Reactiva o Conviértete en Bot secundario', showPrefix: true },
{ comando: 'serbot --code , jadibot --code', descripcion: false, contexto: 'Solicita código de 8 dígitos', showPrefix: true },
{ comando: 'detener , stop', descripcion: false, contexto: 'Dejar de ser temporalmente Sub Bot', showPrefix: true },
{ comando: 'bots , listjadibots', descripcion: false, contexto: 'Lista de Bots secundarios', showPrefix: true },
{ comando: 'borrarsesion , delsession', descripcion: false, contexto: 'Borrar datos de Bot secuandario', showPrefix: true },
{ comando: 'bcbot', descripcion: false, contexto: 'Notificar a usuarios Sub Bots', showPrefix: true },
]
const commandsReport = [
{ comando: 'reporte , report', descripcion: '[texto] || [text]', contexto: 'Reportar comandos con errores', showPrefix: true },
]
const commandsLink = [
{ comando: 'botemporal , addbot', descripcion: '[enlace] [cantidad] || [link] [amount]', contexto: 'Agregar Bot temporalmente a un grupo', showPrefix: true },
]
const commandsPrem = [
{ comando: 'pase premium , pass premium', descripcion: false, contexto: 'Planes para adquirir premium', showPrefix: true },
{ comando: 'listavip , listprem', descripcion: false, contexto: 'Usuarios con tiempo premium', showPrefix: true },
{ comando: 'listapremium , listpremium', descripcion: false, contexto: 'Lista de usuarios premium', showPrefix: true },
]
const commandsGames = [
{ comando: 'matematicas , math', descripcion: '"noob, medium, hard"', contexto: 'Operaciones matemáticas 🧮', showPrefix: true },
{ comando: 'lanzar , launch', descripcion: '"cara" o "cruz"', contexto: 'Moneda de la suerte 🪙', showPrefix: true },
{ comando: 'ppt', descripcion: '"piedra", "papel" o "tijera"', contexto: 'Un clásico 🪨📄✂️', showPrefix: true },
{ comando: 'ttt', descripcion: '[Nombre de la sala] || [Room name]', contexto: 'Tres en línea/rayas ❌⭕', showPrefix: true },
{ comando: 'delttt', descripcion: false, contexto: 'Cerrar/abandonar la partida 🚪', showPrefix: true },
{ comando: 'topgays', descripcion: false, contexto: 'Clasificación de usuarios Gays 🏳️‍🌈', showPrefix: true },
{ comando: 'topotakus', descripcion: false, contexto: 'Clasificación de usuarios Otakus 🎌', showPrefix: true },
{ comando: 'toppajer@s', descripcion: false, contexto: 'Clasificación de usuarios pajeros 🥵', showPrefix: true },
{ comando: 'topintegrantes', descripcion: false, contexto: 'Mejores usuarios 👑', showPrefix: true },
{ comando: 'toplagrasa', descripcion: false, contexto: 'Usuarios más grasosos XD', showPrefix: true },
{ comando: 'toplind@s', descripcion: false, contexto: 'Los más lindos 😻', showPrefix: true },
{ comando: 'topput@s', descripcion: false, contexto: 'Los más p**** 🫣', showPrefix: true },
{ comando: 'toppanafrescos', descripcion: false, contexto: 'Los que más critican 🗿', showPrefix: true },
{ comando: 'topshiposters', descripcion: false, contexto: 'Los que se creen graciosos 🤑', showPrefix: true },
{ comando: 'topfamosos', descripcion: false, contexto: 'Los más conocidos ☝️', showPrefix: true },
{ comando: 'topparejas', descripcion: false, contexto: 'Las 5 mejores 💕', showPrefix: true },
{ comando: 'gay', descripcion: '[@tag]', contexto: 'Perfil Gay 😲', showPrefix: true },
{ comando: 'gay2', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Gay', showPrefix: true },
{ comando: 'lesbiana', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Lesbiana', showPrefix: true },
{ comando: 'manca', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Manca', showPrefix: true },
{ comando: 'manco', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Manco', showPrefix: true },
{ comando: 'pajero', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Pajero', showPrefix: true },
{ comando: 'pajera', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Pajera', showPrefix: true },
{ comando: 'puto', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Puto', showPrefix: true },
{ comando: 'puta', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Puta', showPrefix: true },
{ comando: 'rata', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Rata', showPrefix: true },
{ comando: 'love', descripcion: '[@tag] o [nombre] || [@tag] or [name]', contexto: '(%) de Love', showPrefix: true },
{ comando: 'doxxear', descripcion: '[@tag]', contexto: 'Simular Doxxeo falso 🕵️‍♀️', showPrefix: true },
{ comando: 'pregunta', descripcion: '[texto] || [text]', contexto: 'Pregunta ❔ y responderá', showPrefix: true },
{ comando: 'apostar , slot', descripcion: '[cantidad] || [amount]', contexto: 'Apuesta a la suerte 🎰', showPrefix: true },
{ comando: 'formarpareja', descripcion: false, contexto: 'Une a dos personas 💞', showPrefix: true },
{ comando: 'dado', descripcion: false, contexto: 'Envía un dado aleatorio 🎲', showPrefix: true },
{ comando: 'piropo', descripcion: false, contexto: 'Enviar un piropo 🫢', showPrefix: true },
{ comando: 'chiste', descripcion: false, contexto: 'Envía chistes 🤡', showPrefix: true },
{ comando: 'reto', descripcion: false, contexto: 'Pondrá un reto 😏', showPrefix: true },
{ comando: 'frases', descripcion: '[cantidad 1 al 99] || [amount 1-99]', contexto: 'Envía frases aleatorias 💐', showPrefix: true },
{ comando: 'acertijo', descripcion: false, contexto: 'Responde al mensaje del acertijo 👻', showPrefix: true },
{ comando: 'cancion', descripcion: false, contexto: 'Adivina la canción 🎼', showPrefix: true },
{ comando: 'trivia', descripcion: false, contexto: 'Preguntas con opciones 💭', showPrefix: true },
{ comando: 'pelicula', descripcion: false, contexto: 'Descubre la película con emojis 🎬', showPrefix: true },
{ comando: 'adivinanza', descripcion: false, contexto: 'Adivina adivinador 🧞‍♀️', showPrefix: true },
{ comando: 'ruleta', descripcion: false, contexto: 'Suerte inesperada 💫', showPrefix: true },
{ comando: 'ruletadelban', descripcion:false, contexto: 'Elimina un usuario al azar, solo para admins ☠️', showPrefix: true }
]
const commandsAI = [
{ comando: 'simi', descripcion: '[texto] || [text]', contexto: 'Conversa con SimSimi', showPrefix: true },
{ comando: 'ia , ai', descripcion: '[texto] || [text]', contexto: 'Tecnología de ChatGPT', showPrefix: true },
{ comando: 'delchatgpt', descripcion: false, contexto: 'Eliminar historial de la IA', showPrefix: true },  
{ comando: 'iavoz , aivoice', descripcion: '[texto] || [text]', contexto: 'Respuestas en audios', showPrefix: true },
{ comando: 'calidadimg , qualityimg', descripcion: '(responde con una imagen) || (responds with an image)', contexto: 'Detalles de resolución de imagen', showPrefix: true },
{ comando: 'dalle', descripcion: '[texto] || [text]', contexto: 'Genera imagen a partir de texto', showPrefix: true },
{ comando: 'gemini', descripcion: '[texto] || [text]', contexto: 'IA, Tecnología de Google', showPrefix: true },
{ comando: 'geminimg', descripcion: '(imagen) + [texto] || (image) + [text]', contexto: 'Busca información de una imagen', showPrefix: true },
{ comando: 'hd', descripcion: '(responde con una imagen) || (responds with an image)', contexto: 'Mejorar calidad de imagen', showPrefix: true },
]
