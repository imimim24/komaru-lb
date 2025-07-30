<script lang="ts">
    import Account from "./account/Account.svelte";
    import Notifications from "./Notifications.svelte";
    import {listen} from "../../../../integration/ws";
    import type {
        AccountManagerAdditionEvent,
        AccountManagerLoginEvent,
        AccountManagerMessageEvent
    } from "../../../../integration/events";
    import {notification} from "./notification_store";

    listen("accountManagerAddition", (e: AccountManagerAdditionEvent) => {
        if (!e.error) {
            notification.set({
                title: "AltManager",
                message: `Added account ${e.username}`,
                error: false
            });
        } else {
            notification.set({
                title: "AltManager",
                message: e.error,
                error: true
            });
        }
    });

    listen("accountManagerMessage", (e: AccountManagerMessageEvent) => {
        notification.set({
            title: "AltManager",
            message: e.message,
            error: false
        });
    });

    listen("accountManagerLogin", (e: AccountManagerLoginEvent) => {
        if (!e.error) {
            notification.set({
                title: "AltManager",
                message: `Logged in to account ${e.username}`,
                error: false
            });
        } else {
            notification.set({
                title: "AltManager",
                message: e.error,
                error: true
            });
        }
    });
</script>

<div class="header">
    <Notifications />
    <Account />
</div>

<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: fit-content;
  margin-left: auto;
  pointer-events: auto;
}
</style>
