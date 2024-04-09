import { reloadApp } from "detox-expo-helpers";

describe('App', () => {
  beforeEach(async () => {
    await reloadApp();
  });

  it('should display input fields', async () => {
    await expect(element(by.text('Time Signature'))).toBeVisible();
    await expect(element(by.text('BPM'))).toBeVisible();
    await expect(element(by.text('Bars Between Ticks'))).toBeVisible();
    await expect(element(by.text('Count-in Bars'))).toBeVisible();
  });

  it('should allow input and start metronome', async () => {
    await element(by.text('4')).typeText('4');
    await element(by.text('110')).typeText('120');
    await element(by.text('2')).typeText('3');
    await element(by.text('2')).typeText('4');

    await element(by.text('Start')).tap();
    await expect(element(by.text('Stop'))).toBeVisible();
  });

  it('should show alert when starting with invalid input', async () => {
    await element(by.text('110')).tap();
    await element(by.text('Start')).tap();

    await expect(element(by.text('Value Required'))).toBeVisible();
  });

  it('should allow stopping the metronome', async () => {
    await element(by.text('Stop')).tap();

    await expect(element(by.text('Start'))).toBeVisible();
  });
});
