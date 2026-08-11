"use client";

import { Bell } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { avatarFromName } from "@/features/clients/lib/avatar";
import type { ClientSummary } from "@/features/clients/types/client";
import type { EmailNotificationId } from "@/features/settings/types/settings";

const EMAIL_NOTIFICATION_OPTIONS: { id: EmailNotificationId; label: string }[] = [
  { id: "workoutCompleted", label: "Client completes a workout" },
  { id: "measurementAdded", label: "Client adds a new measurement" },
  { id: "messageReceived", label: "Client sends you a message" },
  { id: "programFinishing", label: "Programs finishing next week" },
];

export function NotificationsTab({ clients }: { clients: ClientSummary[] }) {
  return (
    <div className="flex flex-col gap-8">
      <BrowserNotificationsCard />
      <EmailNotificationsSection />
      <ClientNotificationsSection clients={clients} />
    </div>
  );
}

function subscribeToNotificationPermission() {
  // No standard change event for Notification.permission — handleEnable below updates
  // the override state directly once the user responds to the browser's own prompt.
  return () => {};
}

function getNotificationPermissionSnapshot(): NotificationPermission | "unsupported" {
  return "Notification" in window ? Notification.permission : "unsupported";
}

function getNotificationPermissionServerSnapshot(): NotificationPermission | "unsupported" {
  return "unsupported";
}

function BrowserNotificationsCard() {
  const browserPermission = useSyncExternalStore(
    subscribeToNotificationPermission,
    getNotificationPermissionSnapshot,
    getNotificationPermissionServerSnapshot
  );
  const [override, setOverride] = useState<NotificationPermission | null>(null);
  const permission = override ?? browserPermission;

  if (permission === "unsupported") return null;

  async function handleEnable() {
    const result = await Notification.requestPermission();
    setOverride(result);
  }

  if (permission === "granted") {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Bell className="size-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Browser notifications are enabled</p>
          <p className="text-xs text-muted-foreground">You&apos;ll be notified about client activity in this browser.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-card p-8 text-center ring-1 ring-foreground/10">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
        <Bell className="size-6 text-primary" />
      </div>
      <div>
        <p className="font-heading text-base font-medium text-foreground">Enable Browser Notifications</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Get notified when clients complete workouts, add measurements, or send you messages.
        </p>
      </div>
      <Button type="button" onClick={handleEnable} disabled={permission === "denied"}>
        {permission === "denied" ? "Blocked in browser settings" : "Enable Notifications"}
      </Button>
    </div>
  );
}

function EmailNotificationsSection() {
  const [enabled, setEnabled] = useState<Record<EmailNotificationId, boolean>>({
    workoutCompleted: true,
    measurementAdded: true,
    messageReceived: true,
    programFinishing: true,
  });

  return (
    <div>
      <h2 className="font-heading text-lg font-medium text-foreground">Email Notifications</h2>
      <p className="text-sm text-muted-foreground">Get an email when this happens:</p>

      <div className="mt-4 divide-y divide-border rounded-xl ring-1 ring-foreground/10">
        {EMAIL_NOTIFICATION_OPTIONS.map((option) => (
          <div key={option.id} className="flex items-center justify-between gap-4 p-4">
            <p className="text-sm text-foreground">{option.label}</p>
            <Switch
              checked={enabled[option.id]}
              onCheckedChange={(checked) => setEnabled((prev) => ({ ...prev, [option.id]: checked }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientNotificationsSection({ clients }: { clients: ClientSummary[] }) {
  const [search, setSearch] = useState("");
  const [autoEnableForNewClients, setAutoEnableForNewClients] = useState(true);
  const [clientNotifications, setClientNotifications] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(clients.map((client) => [client.id, true]))
  );

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return clients;
    return clients.filter(
      (client) => client.name.toLowerCase().includes(query) || client.email.toLowerCase().includes(query)
    );
  }, [clients, search]);

  function setAllClientNotifications(value: boolean) {
    setClientNotifications(Object.fromEntries(clients.map((client) => [client.id, value])));
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-medium text-foreground">Notifications</h2>
          <p className="text-sm text-muted-foreground">Which clients do you want to get notifications from:</p>
        </div>
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search Client"
          className="w-56"
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
        <p className="text-sm text-foreground">Automatically enable notifications for new clients</p>
        <Switch checked={autoEnableForNewClients} onCheckedChange={setAutoEnableForNewClients} />
      </div>

      <div className="mt-4 rounded-xl ring-1 ring-foreground/10">
        <div className="flex items-center justify-between gap-4 p-4">
          <p className="text-sm font-medium text-foreground">Clients</p>
          <div className="flex items-center gap-3 text-sm font-medium text-primary">
            <button type="button" onClick={() => setAllClientNotifications(true)} className="hover:underline">
              Turn all on
            </button>
            <button type="button" onClick={() => setAllClientNotifications(false)} className="hover:underline">
              Turn all off
            </button>
          </div>
        </div>

        <div className="divide-y divide-border border-t border-border">
          {filteredClients.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No clients found.</p>
          ) : (
            filteredClients.map((client) => {
              const avatar = avatarFromName(client.name || client.email || "Client", client.id);
              return (
                <div key={client.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar size="sm">
                      {client.avatar && <AvatarImage src={client.avatar} alt={avatar.name} />}
                      <AvatarFallback className={avatar.colorClassName}>{avatar.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{client.name || client.email}</p>
                      {client.name && <p className="text-xs text-muted-foreground">{client.email}</p>}
                    </div>
                  </div>
                  <Switch
                    checked={clientNotifications[client.id] ?? true}
                    onCheckedChange={(checked) =>
                      setClientNotifications((prev) => ({ ...prev, [client.id]: checked }))
                    }
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
