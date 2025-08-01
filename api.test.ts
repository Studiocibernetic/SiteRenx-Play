import { expect } from "expect";
import { listGames } from "./api";

async function testListGames() {
  const result = await listGames({ page: 1, limit: 12 });

  expect(result).toHaveProperty("games");
  expect(result).toHaveProperty("pagination");
  expect(Array.isArray(result.games)).toBe(true);
  expect(result.pagination).toHaveProperty("page");
  expect(result.pagination).toHaveProperty("limit");
  expect(result.pagination).toHaveProperty("total");
  expect(result.pagination).toHaveProperty("totalPages");
  expect(result.pagination.page).toBe(1);
  expect(result.pagination.limit).toBe(12);
}

async function testListGamesWithSearch() {
  // Test that search functionality works without throwing errors
  const result = await listGames({ page: 1, limit: 12, search: "test" });

  expect(result).toHaveProperty("games");
  expect(result).toHaveProperty("pagination");
  expect(Array.isArray(result.games)).toBe(true);
  expect(result.pagination).toHaveProperty("page");
  expect(result.pagination).toHaveProperty("limit");
  expect(result.pagination).toHaveProperty("total");
  expect(result.pagination).toHaveProperty("totalPages");
  expect(result.pagination.page).toBe(1);
  expect(result.pagination.limit).toBe(12);
}

type TestResult = {
  passedTests: string[];
  failedTests: { name: string; error: string }[];
};

export async function _runApiTests() {
  const result: TestResult = { passedTests: [], failedTests: [] };

  const testFunctions = [testListGames, testListGamesWithSearch];

  const finalResult = await testFunctions.reduce(
    async (promisedAcc, testFunction) => {
      const acc = await promisedAcc;
      try {
        await testFunction();
        return {
          ...acc,
          passedTests: [...acc.passedTests, testFunction.name],
        };
      } catch (error) {
        return {
          ...acc,
          failedTests: [
            ...acc.failedTests,
            {
              name: testFunction.name,
              error: error instanceof Error ? error.message : "Unknown error",
            },
          ],
        };
      }
    },
    Promise.resolve(result),
  );

  return finalResult;
}
