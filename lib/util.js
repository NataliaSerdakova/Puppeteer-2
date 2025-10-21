module.exports = {
generateDynamicDaySelector: async function (page) {
  const timestamps = await page.$$eval('.page-nav__day', els =>
    els.map(el => ({
      timestamp: el.getAttribute('data-time-stamp'),
      html: el.outerHTML
    }))
  );

  const now = Math.floor(Date.now() / 1000);
  let minDiff = Infinity;
  let closestTs = null;

  for (const { timestamp } of timestamps) {
    const tsNum = parseInt(timestamp, 10);
    if (isNaN(tsNum)) continue; // пропускаем, если преобразование не удалось
    const diff = Math.abs(tsNum - now);
    if (diff < minDiff) {
      minDiff = diff;
      closestTs = tsNum;
    }
  }

  return closestTs;
 },
isButtonActive: async function (page, buttonSelector) {
    const button = await page.$(buttonSelector);
    if (!button) return false;
    const disabledAttr = await button.evaluate((el) => el.disabled);
    return disabledAttr;
  },
};