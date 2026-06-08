import { test, expect } from '@playwright/test';


const CLUB_ID = 'britsport';

test.beforeEach(async ({ page }) => {
  await page.goto(`/?clubId=${CLUB_ID}`);
});

test('app loads with header, footer and the form', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: 'Club Registration' })
  ).toBeVisible();
  await expect(page.getByText('Lek og Moro')).toBeVisible();
  await expect(page.locator('form h2')).toBeVisible();
});

test('Test validation select membership', async ({
  page,
}) => {
  await page.getByTestId("nextbutton").click();

  await expect(page.getByText('Select a membership type.')).toBeVisible();
  await expect(page.getByLabel('Membership')).toBeVisible();
});

test('fill out the form', async ({
  page,
}) => {
  // Step 1: pick membership option
  await page.getByLabel('Membership').selectOption({ index: 1 });
  await page.getByTestId("nextbutton").click();

   // Step 2: contact details.
  const contact = {
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'adatest2@example.com',
    phoneNumber: '12345678',
    dateOfBirth: '1990-01-01',
  };
  for (const [name, value] of Object.entries(contact)) {
    await page.getByTestId('input' + name).fill(value);
  }
  await page.getByTestId("nextbutton").click();

  // Step 3: review
  await expect(
    page.getByRole('heading', { name: 'Review your details' })
  ).toBeVisible();
  const review = page.locator('dl');
  for (const value of Object.values(contact)) {
    await expect(review.getByText(value, { exact: true })).toBeVisible();
  }
  //only checking that the sendbutton is ready and visible as default to not spam. 
  await expect(page.getByTestId('sendbutton')).toBeVisible();
  
  // Created test to se the whole working app end to end - must change email befor running. It not we can get a 409 if the tests have been run before.
  // which is expected as the email cannot be registered twise. 

  // const responsePromise = page.waitForResponse(
  //   (resp) => resp.url().includes('/clubs/britsport/forms/B171388180BC457D9887AD92B6CCFC86/registrations') && resp.request().method() === 'POST'
  // )
  // await page.getByTestId('sendbutton').click();
  // const response = await responsePromise;
  // expect(response.status()).toBe(201);


});

