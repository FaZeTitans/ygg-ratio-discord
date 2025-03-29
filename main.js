const axios = require('axios');
const schedule = require('node-schedule');
const cheerio = require('cheerio');

const YGG_URL = process.env.YGG_URL;
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

if (!YGG_URL) {
    console.error(
        "Erreur : La variable d'environnement YGG_URL n'est pas définie."
    );
    process.exit(1);
}
if (!DISCORD_WEBHOOK) {
    console.error(
        "Erreur : La variable d'environnement DISCORD_WEBHOOK n'est pas définie."
    );
    process.exit(1);
}

function getRatioEmoji(ratio) {
    try {
        ratio = parseFloat(ratio);
        if (ratio >= 1.0) {
            return ':green_circle:';
        }

        return ':red_circle:';
    } catch (error) {
        return ':black_circle:';
    }
}

function convertDataToOctets(data) {
    const value = data.slice(0, -2);
    const unit = data.slice(-2);
    // Convert to Go
    if (unit == 'Po') {
        return parseFloat(value * 1125899906842624);
    } else if (unit == 'To') {
        return parseFloat(value * 1099511627776);
    } else if (unit == 'Go') {
        return parseFloat(value * 1073741824);
    }
    return -1;
}

function formatOctets(bytes, decimals = 2) {
    if (bytes === 0) return '~0';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
}

function getGap(up, down) {
    const upGo = convertDataToOctets(up);
    const downGo = convertDataToOctets(down);
    if (upGo === -1 || downGo === -1) {
        return '?';
    }
    const gap = upGo - downGo;
    checkWarning(gap);
    return formatOctets(gap);
}

let isWarning = '';
function checkWarning(gap) {
    if (gap === '?') {
        isWarning = '';
    }
    if (gap < 107374182400) {
        // 100 Go
        isWarning = ' :warning:';
    }
    return;
}

async function fetchAndSendData() {
    const today = new Date().toLocaleDateString('fr-FR', {
        timeZone: 'Europe/Paris',
    });

    try {
        const response = await axios.get(YGG_URL, {
            headers: {
                'User-Agent':
                    process.env.USER_AGENT ||
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
                Cookie: process.env.YGG_COOKIE,
            },
        });

        if (response.status !== 200) {
            return await axios.post(DISCORD_WEBHOOK, {
                content: null,
                embeds: [
                    {
                        title: `YGG Ratio - ${today}`,
                        description: `:warning: **Erreur lors de la récupération des données** : ${response.status} ${response.statusText}`,
                        url: process.env.YGG_URL,
                        color: 16711680,
                    },
                ],
                attachments: [],
            });
        }

        const html = response.data;

        const $ = cheerio.load(html);

        const updown = $('#top_panel .ct ul li:first-child')
            .text()
            .trim()
            .split('-');

        const up = updown[0].trim();
        const down = updown[1].trim();

        const gap = getGap(up, down);

        const ratio = $('#top_panel .ct ul li:nth-child(2)')
            .text()
            .trim()
            .split(':')[1]
            .trim();

        await axios.post(DISCORD_WEBHOOK, {
            content: null,
            embeds: [
                {
                    title: `YGG Ratio - ${today}`,
                    description: `${getRatioEmoji(
                        ratio
                    )} **Ratio : ${ratio}**${isWarning}\n\n:small_red_triangle: ${up}\n:small_red_triangle_down:  ${down}\n**:small_orange_diamond: Gap: ${gap}**`,
                    url: process.env.YGG_URL,
                    color: 10019802,
                },
            ],
            attachments: [],
        });

        console.info(`${today} - Données envoyées à Discord avec succès.`);
    } catch (error) {
        console.error(
            `${today} - Erreur lors de la récupération ou l'envoi des données :`,
            error
        );
    }
}

// Planification quotidienne à minuit
schedule.scheduleJob('0 0 * * *', fetchAndSendData);
console.info('Script initialisé avec succès.');

if (process.env.RUN_ON_STARTUP === 'true') {
    console.log(
        'Variable RUN_ON_STARTUP détectée. Exécution immédiate (debug)'
    );

    fetchAndSendData().catch((error) =>
        console.error("Erreur lors de l'exécution immédiate :", error)
    );
}