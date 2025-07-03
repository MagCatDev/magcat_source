import app from "../src/rip.acg";

test("si.nyaa", async () => {
    const res = await app.search({ query: "seed" });
    console.log(res);
    expect(res).toBeDefined();
    expect(res.items.length).toBeGreaterThan(0);
    expect(res.hasMore).toBeTruthy();
    expect(res.next.url).toBeDefined();
});