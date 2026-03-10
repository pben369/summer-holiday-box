export const parseM3U = async (url) => {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const lines = text.split('\n');

        const channels = [];
        let currentChannel = {};

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (line.startsWith('#EXTINF:')) {
                // Extract attributes like tvg-id, tvg-logo, tvg-name, group-title
                const idMatch = line.match(/tvg-id="(.*?)"/);
                const logoMatch = line.match(/tvg-logo="(.*?)"/);
                const titleMatch = line.split(',').pop();
                const groupMatch = line.match(/group-title="(.*?)"/);

                currentChannel = {
                    id: idMatch ? idMatch[1] : Math.random().toString(36).substr(2, 9),
                    name: titleMatch || 'Unknown Channel',
                    logo: logoMatch ? logoMatch[1] : null,
                    category: groupMatch ? groupMatch[1] : 'Kids',
                };
            } else if (line && !line.startsWith('#')) {
                if (currentChannel.name) {
                    currentChannel.url = line;

                    // Filter by region/language based on tvg-id
                    // .us, .uk, .ca, .au, .nz are primarily English
                    // .in is India (Hindi, Telugu, Kannada, Tamil, etc.)
                    const chId = currentChannel.id.toLowerCase();
                    const chName = currentChannel.name.toLowerCase();

                    if (chId.includes('.us') ||
                        chId.includes('.uk') ||
                        chId.includes('.ca') ||
                        chId.includes('.au') ||
                        chId.includes('.in')) {

                        // Filter out geoblocked ones
                        const isGeoBlocked = chName.includes('geo-blocked') || chName.includes('geoblocked');

                        // Filter out specific channels
                        const unwantedKeywords = [
                            'abc entertains', 'christian youth channel', '3abn', '9go',
                            'sonic', 'sony yay', 'zb cartoon', 'wjlp-dt2', 'tvs pinball',
                            'tvs hi tops', 'tvo kids', 'toon goggles', 'tiny pop',
                            'teletubbies', 'super hungama', 'shaun the sheep', 'ninja kid',
                            'ryan and friends', 'pocket watch', 'pocket.watch',
                            'nicktoons', 'nickelodeon', 'nick', 'kids pang', 'ncm',
                            'super simple songs', 'skwad', 'moonbug kids', 'mcn6 music',
                            'lego channel', 'kushi tv', 'kochu tv', 'kidsflix',
                            'kidoodle', 'ketchup tv', 'disney channel east', 'disney channel (576p)',
                            'chithiram', 'chintu tv', 'cbeebies', 'camp spoopy', 'camp snoopy',
                            'brat tv', 'babyfirst', 'baby shark', 'aghapy kids', 'aghapykids', 'abc kids',
                            'tvokids', 'hungama tv', 'hungama'
                        ];

                        const isUnwanted = unwantedKeywords.some(keyword => chName.includes(keyword));

                        if (!isGeoBlocked && !isUnwanted) {
                            channels.push(currentChannel);
                        }
                    }

                    currentChannel = {}; // Reset for next valid channel
                }
            }
        }

        return channels;
    } catch (error) {
        console.error("Failed to fetch or parse M3U:", error);
        return [];
    }
};
