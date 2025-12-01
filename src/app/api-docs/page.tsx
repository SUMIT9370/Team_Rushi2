import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import { Badge } from "@/components/ui/badge";

const endpoints = [
  {
    method: "POST",
    path: "/api/auth/signup",
    description: "Create a new user account.",
    request: `{\n  "name": "John Doe",\n  "email": "john.doe@example.com",\n  "password": "yourstrongpassword"\n}`,
    response: `{\n  "message": "User created successfully",\n  "userId": "some-user-id"\n}`,
  },
  {
    method: "POST",
    path: "/api/auth/login",
    description: "Authenticate a user and receive a JWT.",
    request: `{\n  "email": "john.doe@example.com",\n  "password": "yourstrongpassword"\n}`,
    response: `{\n  "token": "ey...your.jwt.token..."\n}`,
  },
  {
    method: "GET",
    path: "/api/weather/current?lat=...&lon=...",
    description: "Get current weather conditions for a specific location.",
    response: `{\n  "temperature": 25,\n  "condition": "Clear",\n  "humidity": 60\n}`,
  },
  {
    method: "GET",
    path: "/api/forecast?lat=...&lon=...",
    description: "Get a 5-day weather forecast.",
    response: `[\n  {\n    "date": "2024-07-22",\n    "max_temp": 28,\n    "min_temp": 18,\n    "condition": "Sunny"\n  },\n  ...\n]`,
  },
  {
    method: "GET",
    path: "/api/alerts?lat=...&lon=...",
    description: "Get active weather alerts for a location.",
    response: `[]`,
  },
];

export default function ApiDocsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">API Documentation</h2>
        <p className="text-muted-foreground">
          Here are the available REST API endpoints for the Team Varsha application.
        </p>
      </div>

      <div className="space-y-6">
        {endpoints.map((endpoint) => (
          <Card key={endpoint.path} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Badge variant={endpoint.method === 'GET' ? 'default' : 'secondary'}>
                  {endpoint.method}
                </Badge>
                <CardTitle className="font-code text-lg tracking-wider">{endpoint.path}</CardTitle>
              </div>
              <CardDescription className="pt-2">{endpoint.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {endpoint.request && (
                <div>
                  <h4 className="font-semibold mb-2">Request Body</h4>
                  <CodeBlock code={endpoint.request} lang="json" />
                </div>
              )}
              {endpoint.response && (
                <div>
                  <h4 className="font-semibold mb-2">Sample Response</h4>
                  <CodeBlock code={endpoint.response} lang="json" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
