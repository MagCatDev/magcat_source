import app from "../src/org.kisssub";

test("org.kisssub", async () => {
  const res = await app.search({ query: "seed" });
  console.log(res);
  expect(res).toBeDefined();
  expect(res.items.length).toBeGreaterThan(0);
  expect(res.hasMore).toBeTruthy();
  expect(res.next.url).toBeDefined();
});