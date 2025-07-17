<script lang="ts">
    import { flip } from "svelte/animate";
    import { listen } from "../../../../integration/ws";
    import { fly } from "svelte/transition";
    import Notification from "./Notification.svelte";
    import type { NotificationEvent } from "../../../../integration/events";

    import enable from "/sounds/on.mp3";
    import disable from "/sounds/off.mp3";
    import warn from "/sounds/warn.mp3";
    import error from "/sounds/error.mp3";
    import success from "/sounds/success.mp3";
    import { Howl } from "howler";

    interface TNotification {
        animationKey: number;
        id: number;
        title: string;
        severity: string;
        message: string;
    }

    let notifications: TNotification[] = [];

    function addNotification(title: string, message: string, severity: string) {
        let animationKey = Date.now();
        const id = animationKey;

        if (severity === "ENABLED" || severity === "DISABLED") {
            const index = notifications.findIndex((n) => n.message === message);
            if (index !== -1) {
                animationKey = notifications[index].animationKey;
                notifications.splice(index, 1);
            }
        }

        notifications = [
            { animationKey, id, title, message, severity },
            ...notifications,
        ];

        setTimeout(() => {
            notifications = notifications.filter((n) => n.id !== id);
        }, 1500);

        playSound(severity);
    }

    function playSound(severity: string) {
        let sound: string | null = null;

        switch (severity) {
            case "ENABLED":
                sound = enable;
                break;
            case "DISABLED":
                sound = disable;
                break;
            case "ERROR":
                sound = error;
                break;
            case "INFO":
                sound = warn;
                break;
            case "SUCCESS":
                sound = success;
                break;
        }

        if (sound) {
            const sfx = new Howl({ src: [sound], html5: true, preload: true });
            sfx.play();
        }
    }

    listen("notification", (e: NotificationEvent) => {
        addNotification(e.title, e.message, e.severity);
    });
</script>

<div class="notifications">
    {#each notifications as {title, message, severity, animationKey} (animationKey)}
        <div
                animate:flip={{ duration: 300 }}
                in:fly={{ y: 30, duration: 300 }}
                out:fly={{ y: 30, duration: 300 }}
        >
            <Notification {title} {message} {severity}/>
        </div>
    {/each}
</div>

<style>
.notifications {
    position: absolute;
    left: 50%;
    top: calc(50% + 32px);
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    z-index: 1000;
    pointer-events: none;
}
</style>

