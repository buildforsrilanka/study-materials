import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function TestUI() {
  return (
    <div className="container max-w-2xl py-8 space-y-8">
      <h1 className="text-3xl font-bold">shadcn/ui Component Test</h1>

      <Alert>
        <AlertDescription>
          ✅ shadcn/ui components are working correctly!
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="test">Test Input</Label>
            <Input id="test" placeholder="Type here..." />
          </div>
          <Button>Test Button</Button>
          <Button variant="outline">Outline Button</Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Installed Components:</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Button ✓</li>
          <li>Card ✓</li>
          <li>Input ✓</li>
          <li>Label ✓</li>
          <li>Select ✓</li>
          <li>Textarea ✓</li>
          <li>Dialog ✓</li>
          <li>Alert ✓</li>
          <li>Tabs ✓</li>
        </ul>
      </div>
    </div>
  )
}
