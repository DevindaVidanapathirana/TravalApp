import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Alerts</h2>
        <p className="text-muted-foreground">
          System alerts and notifications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will show detailed alerts and notification management.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
