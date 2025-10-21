const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const {
	Given,
	When,
	Then,
	Before,
	After,
	setDefaultTimeout,
} = require("@cucumber/cucumber");

const {clickElement, getText} = require("../../lib/commands.js");
const {generateDynamicDaySelector, isButtonActive} = require("../../lib/util.js");

setDefaultTimeout(70000);

Before(async function() {
	const browser = await puppeteer.launch({
		headless: false,
		slowMo: 300
	});
	const page = await browser.newPage();
	this.browser = browser;
	this.page = page;
});

After(async function() {
	if (this.browser) {
		await this.browser.close();
	}
});

Given("user is on {string} page", async function(string) {
	return await this.page.goto(`https://qamid.tmweb.ru${string}`, );
});

When("user books a ticket for the movie Stalker", async function() {
	const closestTimestamp = await generateDynamicDaySelector(this.page);
	const daySelector = `.page-nav__day[data-time-stamp="${closestTimestamp}"]`;
	await clickElement(this.page, daySelector);
	await clickElement(this.page, 'a.movie-seances__time[data-seance-id="217"][data-seance-start="780"]');
	await clickElement(this.page, '.buying-scheme__wrapper .buying-scheme__chair:not(.buying-scheme__chair_taken)');
	await clickElement(this.page, 'button.acceptin-button');
	await clickElement(this.page, 'button.acceptin-button[onclick*="sale_save.php"]');
});

Then("user should see the general confirmation {string}", async function(string) {
	const expected = await string;
	const actual = await getText(this.page, '.ticket__hint');
	expect(actual).contains(expected);
});

When("user books a VIP ticket for the movie Witcher", async function() {
	const closestTimestamp = await generateDynamicDaySelector(this.page);
	const daySelector = `.page-nav__day[data-time-stamp="${closestTimestamp}"]`;
	await clickElement(this.page, daySelector);
	await clickElement(this.page, "a.movie-seances__time[data-seance-id=\"225\"][data-seance-start=\"1020\"]");
	await clickElement(this.page, '.buying-scheme__chair.buying-scheme__chair_vip:not(.buying-scheme__chair_taken)');
	await clickElement(this.page, 'button.acceptin-button');
	await clickElement(this.page, 'button.acceptin-button[onclick*="sale_save.php"]');
});

Then("user should see the special confirmation {string}", async function(string) {
	const expected = await string;
	const actual = await getText(this.page, '.ticket__hint');
	expect(actual).contains(expected);
});

When("user clicks the \"Book\" button without selecting a seat", async function() {
	const closestTimestamp = await generateDynamicDaySelector(this.page);
	const daySelector = `.page-nav__day[data-time-stamp="${closestTimestamp}"]`;
	await clickElement(this.page, daySelector);
	await clickElement(this.page, "a.movie-seances__time[data-seance-id=\"237\"][data-seance-start=\"920\"]");
	const bookButtonSelector = 'button.acceptin-button';
	await this.page.waitForSelector(bookButtonSelector);
});

Then("user sees that the button is inactive", async function() {
	const bookButtonSelector = 'button.acceptin-button';
	const isDisabled = await isButtonActive(this.page, bookButtonSelector);
	expect(isDisabled).to.be.true;
});
