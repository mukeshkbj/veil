import assert from "node:assert/strict";
import { test } from "node:test";
import { type Lab, hexToLab } from "./color.ts";
import { doseFactor, nextSwipe, predictShelf } from "./shelf.ts";

const DEEP: Lab = { L: 40, a: 13, b: 19 };
const FAIR: Lab = { L: 72, a: 11, b: 15 };

test("on deep skin a clear gel ranks above an untinted zinc stick", () => {
  const ranked = predictShelf(DEEP, []).map((p) => p.product.id);
  assert.ok(ranked.indexOf("clearweight") < ranked.indexOf("beach-stick"));
  assert.equal(predictShelf(DEEP, []).find((p) => p.product.id === "beach-stick")?.verdict, "ghost");
});

test("tinted products pick the shade nearest the skin, and a short shade range leaves deep skin out", () => {
  const ranked = predictShelf(DEEP, []);
  assert.equal(ranked.find((p) => p.product.id === "tint-five")?.shade.name, "Deep");
  const three = ranked.find((p) => p.product.id === "tint-three")!;
  const five = ranked.find((p) => p.product.id === "tint-five")!;
  assert.ok(three.dE > five.dE);
});

test("a heavier swipe than expected raises every prediction", () => {
  const before = predictShelf(DEEP, []).find((p) => p.product.id === "daylight")!.dE;
  const prior = predictShelf(DEEP, []).find((p) => p.product.id === "bare-zinc")!.dE;
  const after = predictShelf(DEEP, [{ productId: "bare-zinc", shade: "Untinted", dE: prior * 1.4 }]).find((p) => p.product.id === "daylight")!.dE;
  assert.ok(doseFactor(DEEP, [{ productId: "bare-zinc", shade: "Untinted", dE: prior * 1.4 }]) > 1);
  assert.ok(after > before);
});

test("the same zinc reads as a ghost on deep skin and much fainter on fair skin", () => {
  const zinc = (skin: Lab) => predictShelf(skin, []).find((p) => p.product.id === "bare-zinc")!.dE;
  assert.ok(zinc(DEEP) > 2 * zinc(FAIR));
});

test("the agent asks for a swipe only while the top two could swap places", () => {
  const ranked = predictShelf(DEEP, []);
  const advice = nextSwipe(ranked);
  assert.equal(advice.kind, "swipe");
  if (advice.kind === "swipe") assert.ok([ranked[0], ranked[1]].includes(advice.next) && !advice.next.measured);
  const [first, second] = ranked;
  const apart = [
    { ...first, range: [0.5, 0.9] as [number, number] },
    { ...second, range: [2, 3] as [number, number] },
  ];
  assert.equal(nextSwipe(apart).kind, "settled");
});

test("a swipe too faint to read, or a tint that matches the skin, leaves the dose alone", () => {
  const medium = hexToLab("#c4906b");
  assert.equal(doseFactor(DEEP, [{ productId: "clearweight", shade: "Untinted", dE: 0.5 }]), 1);
  assert.equal(doseFactor(medium, [{ productId: "tint-five", shade: "Medium", dE: 3 }]), 1);
  assert.ok(doseFactor(DEEP, [{ productId: "bare-zinc", shade: "Untinted", dE: 40 }]) <= 4);
});
