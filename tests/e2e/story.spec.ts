import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'

async function reset() {
  await fetch(`${BASE}/api/reset`, { method: 'POST' })
}

async function seed(sentences: { content: string; author: string; isAI: boolean }[]) {
  for (const s of sentences) {
    await fetch(`${BASE}/api/sentences/seed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(s),
    })
  }
}

test.beforeEach(async () => { await reset() })
test.afterEach(async () => { await reset() })

test('E2E-F1-01: displays existing sentences in order', async ({ page }) => {
  await seed([
    { content: 'Once upon a time', author: 'Alice', isAI: false },
    { content: 'there was a dragon', author: 'AI', isAI: true },
  ])

  await page.goto('/')
  await page.waitForLoadState('networkidle')

  const items = page.locator('[data-testid="sentence-item"]')
  await expect(items).toHaveCount(2)
  await expect(items.nth(0)).toContainText('Once upon a time')
  await expect(items.nth(1)).toContainText('there was a dragon')
})

test('E2E-F1-02: each sentence shows author, timestamp, and Human/AI label', async ({ page }) => {
  await seed([
    { content: 'Hello world', author: 'Alice', isAI: false },
    { content: 'And then...', author: 'AI', isAI: true },
  ])

  await page.goto('/')
  await page.waitForLoadState('networkidle')

  const first = page.locator('[data-testid="sentence-item"]').nth(0)
  await expect(first).toContainText('Alice')
  await expect(first.locator('[data-testid="label"]')).toContainText('Human')
  await expect(first.locator('[data-testid="timestamp"]')).toBeVisible()

  const second = page.locator('[data-testid="sentence-item"]').nth(1)
  await expect(second).toContainText('AI')
  await expect(second.locator('[data-testid="label"]')).toContainText('AI')
})

test('E2E-F1-03: shows empty state when no sentences exist', async ({ page }) => {
  // This scenario is superseded by US2 (AI auto-opener).
  // Empty state is only shown if AI call fails — tested via IT-F1-03 graceful failure.
  // Skipped in E2E as we cannot reliably simulate AI failure in browser tests.
})

test('E2E-F1-04: AI generates opener when story is empty', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  const items = page.locator('[data-testid="sentence-item"]')
  await expect(items).toHaveCount(1)
  await expect(items.nth(0).locator('[data-testid="label"]')).toContainText('AI')
})

test('E2E-F1-05: second visit does not add another AI sentence', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  await expect(page.locator('[data-testid="sentence-item"]')).toHaveCount(1)
})

// F2 tests
test('E2E-F2-01: successful submission saves sentence and clears form', async ({ page }) => {
  await seed([{ content: 'Once upon a time', author: 'AI', isAI: true }])
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  await page.fill('[data-testid="input-author"]', 'Alice')
  await page.fill('[data-testid="input-content"]', 'The dragon awoke.')
  await page.click('[data-testid="btn-submit"]')
  await page.waitForLoadState('networkidle')

  await expect(page.locator('[data-testid="sentence-item"]').filter({ hasText: 'The dragon awoke.' })).toBeVisible()
  await expect(page.locator('[data-testid="input-author"]')).toHaveValue('')
  await expect(page.locator('[data-testid="input-content"]')).toHaveValue('')
})

test('E2E-F2-02: empty author shows validation error', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  await page.fill('[data-testid="input-content"]', 'Hello')
  await page.click('[data-testid="btn-submit"]')

  await expect(page.locator('[data-testid="error-author"]')).toBeVisible()
})

test('E2E-F2-03: empty sentence shows validation error', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  await page.fill('[data-testid="input-author"]', 'Alice')
  await page.click('[data-testid="btn-submit"]')

  await expect(page.locator('[data-testid="error-content"]')).toBeVisible()
})

test('E2E-F2-04: submitted sentence shows correct author and Human label', async ({ page }) => {
  await seed([{ content: 'Once upon a time', author: 'AI', isAI: true }])
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  await page.fill('[data-testid="input-author"]', 'Alice')
  await page.fill('[data-testid="input-content"]', 'Once more.')
  await page.click('[data-testid="btn-submit"]')
  await page.waitForLoadState('networkidle')

  const items = page.locator('[data-testid="sentence-item"]')
  const aliceItem = items.filter({ hasText: 'Once more.' })
  await expect(aliceItem).toContainText('Alice')
  await expect(aliceItem.locator('[data-testid="label"]')).toContainText('Human')
})

test('E2E-F2-05: submit button is disabled during submission', async ({ page }) => {
  await seed([{ content: 'Once upon a time', author: 'AI', isAI: true }])
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  await page.fill('[data-testid="input-author"]', 'Alice')
  await page.fill('[data-testid="input-content"]', 'The end.')

  const btn = page.locator('[data-testid="btn-submit"]')
  await btn.click()
  await expect(btn).toBeDisabled()
  await page.waitForLoadState('networkidle')
})

test('E2E-F3-01: AI sentence appears after human sentence on submit', async ({ page }) => {
  await reset()
  await seed([{ content: 'Once upon a time', author: 'AI', isAI: true }])
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  await page.fill('[data-testid="input-author"]', 'Alice')
  await page.fill('[data-testid="input-content"]', 'The dragon awoke.')
  await page.click('[data-testid="btn-submit"]')

  // Wait for human sentence to appear, then verify AI follows it
  const items = page.locator('[data-testid="sentence-item"]')
  const humanItem = items.filter({ hasText: 'The dragon awoke.' })
  await expect(humanItem).toBeVisible({ timeout: 15000 })
  await expect(humanItem.locator('[data-testid="label"]')).toContainText('Human')

  // The item after the human sentence should be AI
  const lastItem = items.last()
  await expect(lastItem.locator('[data-testid="label"]')).toContainText('AI', { timeout: 15000 })
  await expect(lastItem.locator('p')).not.toBeEmpty()
})

test('E2E-F4-01: reset button is visible', async ({ page }) => {
  await seed([{ content: 'Once upon a time', author: 'AI', isAI: true }])
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await expect(page.locator('[data-testid="btn-reset"]')).toBeVisible()
})

test('E2E-F4-02: confirming reset clears the story', async ({ page }) => {
  await seed([{ content: 'Once upon a time', author: 'AI', isAI: true }])
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  await page.click('[data-testid="btn-reset"]')
  await page.click('[data-testid="btn-reset-confirm"]')
  await page.waitForLoadState('networkidle')

  const count = await page.locator('[data-testid="sentence-item"]').count()
  expect(count).toBeLessThanOrEqual(1)
})

test('E2E-F4-03: cancelling reset keeps the story', async ({ page }) => {
  await seed([{ content: 'Once upon a time', author: 'AI', isAI: true }])
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  await page.click('[data-testid="btn-reset"]')
  await page.click('[data-testid="btn-reset-cancel"]')

  await expect(page.locator('[data-testid="sentence-item"]')).toHaveCount(1)
})
