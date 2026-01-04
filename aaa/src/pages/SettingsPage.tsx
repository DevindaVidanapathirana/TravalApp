import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Configure dashboard preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will include user preferences, notification settings, and system configuration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
