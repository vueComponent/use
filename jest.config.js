module.exports = {
  testURL: 'http://localhost/',
  testRegex: '.*\\.spec\\.tsx?$',
  collectCoverageFrom:[
    "**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/__demo__/**",
    "!**/__test__/**",
    "!**/demo/**",
  ]
};
