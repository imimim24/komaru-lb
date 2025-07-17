<script lang="ts">
    import Tab from "../../common/modal/Tab.svelte";
    import IconTextInput from "../../common/setting/IconTextInput.svelte";
    import ButtonSetting from "../../common/setting/ButtonSetting.svelte";
    import {
        directLoginToCrackedAccount,
        randomUsername,
    } from "../../../../integration/rest";
    import IconButton from "../../common/buttons/IconButton.svelte";
    import SwitchSetting from "../../common/setting/SwitchSetting.svelte";
    import { faker } from "@faker-js/faker";
    import SingleSelect from "../../common/setting/select/SingleSelect.svelte";

    let username = "";
    let online = false;
    let mode = "Default";

    // haha stupid name generator its so stupid so stupid so stupid haha jjajaja jajjajj kkkkk
    const prefixes = [
    "heartfor", "xdeadfor", "mr", "xx", "zz", "the", "itzreal", "notfake", "twitch", "youtube", "yt", "tv", "ttv", "zxc",
    "og_", "by", "ultra", "pro", "epic", "kek", "silly", "crazy", "happy", "sad", "angry", "chill", "lazy", "fast", "slow",
    "smart", "dumb", "cute", "ugly", "weird", "lil", "random", "unique", "was", "swag", "damn", "bruh", "bro", "dude",
    "qweqwe", "why", "fake", "real", "dead", "soft", "aim", "ctrl", "1v9", "aimbot", "clutch", "rekt", "hard", "flex",
    "dark", "void", "no", "kill", "drop", "try", "solo", "nono", "rip", "bebra", "uwu", "cry", "mid", "low", "hyper",
    "kid", "yxng", "mumble", "dr1p", "cold", "lean", "trap", "sk8r"
    ];


    const words = [
    "ezzka", "ansoft", "sigma", "vlad", "shmel", "izthe", "swqzza", "imsweet", "d1zzyy", "waster", "putin", "obama", "patron",
    "dimasik", "ishak_", "nyashka", "sanya", "genshin", "ghoul", "itzreal", "died", "axaxxa", "2x2", "forever", "happy",
    "tryxy", "n1ghtz", "qxzzy", "softik", "ghost", "crybaby", "sadvoid", "4imdead", "k1tty", "d3monik", "darkzero", "bruhman",
    "whycry", "lavashka", "n3rdyy", "shadow", "izzdead", "xquit", "itsmevova", "djasi", "de4dly", "nohope", "cl0wnz",
    "zkiller", "cryzed", "v1perok", "dropik", "bleachme", "nekodead", "sadlifee", "0verdose", "rektual", "sm0kerz",
    "darkaura", "meowww", "fakedream", "voidchik", "zer0mercy", "m0rtyyy", "nightcarry", "bratan", "gachilord",
    "kebabmaster", "kurwaslayer", "notcry", "s1lent", "69iqplayer", "blushyface", "sakura", "ctrldead", "m1lkaa",
    "cutie", "shlepaking", "mechtvoeymamy", "paininside", "imfade", "nowinnr", "dontread", "washedaim", "solovoid",
    "p1xel", "toxictyan", "destroyer", "hardtapper", "aimcry", "rush", "dripsoft", "midpeeker", "nefor", "deadlag",
    "1shotbaby", "kitsunez", "voidstep", "plznoob", "daddy", "vibekiller", "dreamdrop", "nikita", "hikikomori",
    "bebraxpert", "cryfrag", "noshield", "tvoyamama", "nagibator", "kawaii", "bebra", "shlepa", "vodka", "ping300",
    "deadinside", "cringebaby", "tyankiller", "bruhdead", "tapok", "gopnikgod", "pepeonmid", "slozhno", "elpapa",
    "gachi", "trycry", "mortyfragz", "obshagaboss", "snvslove", "animeslesar", "durexmain", "kazik", "cryinshawarma",
    "afk_bebra", "loverofborscht", "rzhka", "loxdestroyer", "lowiqgod", "clownmod", "sasat", "mamka", "luzerslayer",
    "flashbang", "classic", "neponel", "tryhard", "tryme", "zoomer", "mambet", "durok", "granny", "xaxaxa", "wkozz",
    "sadkazakh", "krinzhovina", "bebrasniper", "luvyourdad", "6sick", "facepalm"
    ];


    const ends = [
    "xx", "228", "1337", "yt", "mc", "lol", "gg", "qw", "zz", "_", "ru", "kz", "eu", "us", "007", "2010", "2007",
    "666", "777", "123", "456", "789", "321", "999", "fr", "rn", "ik", "wp", "uwu", "rip", "xd", "lmao", "nuh", "uh",
    "ha", "ah", "hm", "phew", "ouch", "um", "brr", "huh", "ontop", "4life", "nocap", "irl", "xoxo", "noscope", "1v1",
    "ez", "flex", "lag", "aim", "bot", "afk", "ace", "clutch", "solo", "n1", "zxc", "dead", "drop", "cam", "aimed",
    "glhf", "rekt", "carry", "sus", "mid", "low", "luv", "gxd", "404", "808"
    ];

    async function login() {
        await directLoginToCrackedAccount(username, online);
    }

    async function generateRandomUsername() {
        if (mode === "Default") {
            username = await randomUsername();
        } else if (mode === "Internet") {
            username = faker.internet
                .userName()
                .substring(0, 16)
                .replace(/[^a-zA-Z0-9_]+/gi, "_");
        } else if (mode === "Silly") {
            username =
                faker.word.sample().substring(0, 16) +
                "_" +
                faker.word.interjection().replace(/[^a-zA-Z0-9_]+/gi, "");
        } else if (mode === "Stupid") {
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const word = words[Math.floor(Math.random() * words.length)];
            let end = ends[Math.floor(Math.random() * ends.length)];
            if (Math.random() < 0.3) {
                const chars = "abcdefghijklmnopqrstuvwxyz0123456789_";
                end = chars.charAt(Math.floor(Math.random() * chars.length)) + chars.charAt(Math.floor(Math.random() * chars.length));
            }
            username = (prefix + word + end).substring(0, 16);
        }
    }
</script>

<Tab>
    <IconTextInput
        icon="user"
        title="Username"
        pattern={"[a-zA-Z0-9_]{1,16}"}
        bind:value={username}
        maxLength={16}
    >
        <IconButton
            icon="random"
            title="Random"
            on:click={generateRandomUsername}
        />
    </IconTextInput>
    <SwitchSetting title="Use online UUID" bind:value={online} />
    <SingleSelect
        title="Generator Mode"
        options={["Default", "Internet", "Silly", "Stupid"]}
        bind:value={mode}
    />
    <ButtonSetting
        title="Login"
        on:click={login}
        listenForEnter={true}
        inset={true}
    />
</Tab>
