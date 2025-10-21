const { describe, test, beforeAll, afterAll } = require("@jest/globals");
const { clickElement, getText} = require("./lib/commands");
const {generateDynamicDaySelector, isButtonActive } = require("./lib/util");

let page;
beforeAll(async () => {
  page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
});

afterAll(() => {
  page.close();
});

describe("Ticket booking", () => {
    beforeEach(async () => {
        await page.goto("https://qamid.tmweb.ru/client/hall.php");
    });

  test("Booking a ticket for the film Stalker", async () => {
    const expected = "Покажите QR-код нашему контроллеру для подтверждения бронирования."
    const closestTimestamp = await generateDynamicDaySelector(page);
    const daySelector = `.page-nav__day[data-time-stamp="${closestTimestamp}"]`;
    await page.waitForSelector(daySelector);
    await clickElement(page, daySelector);   
    await clickElement(page, "a.movie-seances__time[data-seance-id=\"217\"][data-seance-start=\"780\"]");
    await clickElement(page, ".buying-scheme__wrapper .buying-scheme__chair:not(.buying-scheme__chair_taken)");
    await clickElement(page, "button.acceptin-button");
    await clickElement(page, "button.acceptin-button[onclick*=\"sale_save.php\"]");
    const actual = await getText(page, '.ticket__hint');
    expect(actual).toContain(expected);
  });

   test("Book a VIP ticket to The Witcher", async () => {
    const expected = "Покажите QR-код нашему контроллеру для подтверждения бронирования."
    const closestTimestamp = await generateDynamicDaySelector(page);
    const daySelector = `.page-nav__day[data-time-stamp="${closestTimestamp}"]`;
    await page.waitForSelector(daySelector);
    await clickElement(page, daySelector);
    await clickElement(page, "a.movie-seances__time[data-seance-id=\"225\"][data-seance-start=\"1020\"]");
    await clickElement(page, ".buying-scheme__chair.buying-scheme__chair_vip:not(.buying-scheme__chair_taken)");
    await clickElement(page, "button.acceptin-button");
    await clickElement(page, "button.acceptin-button[onclick*=\"sale_save.php\"]");
    const actual = await getText(page, '.ticket__hint');
    expect(actual).toContain(expected);
});

 test("The book button is not activer", async () => {
    const closestTimestamp = await generateDynamicDaySelector(page);
    const daySelector = `.page-nav__day[data-time-stamp="${closestTimestamp}"]`;
    await page.waitForSelector(daySelector);
    await clickElement(page, daySelector);
    await clickElement(page, "a.movie-seances__time[data-seance-id=\"237\"][data-seance-start=\"920\"]");
    const bookButtonSelector = 'button.acceptin-button';
    await page.waitForSelector(bookButtonSelector);
    const isDisabled = await isButtonActive(page, bookButtonSelector);
    expect(isDisabled).toBe(true);
 });
});


