/**
 * @type {import('prettier').Options}
 */
export default {
    printWidth: 120,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: false,
    trailingComma: "all",
    bracketSpacing: true,
    bracketSameLine: true,
    plugins: ["@ianvs/prettier-plugin-sort-imports"],
    importOrder: [
        "<BUILTIN_MODULES>",
        "<THIRD_PARTY_MODULES>",
        "^@/assets/(.*)$",
    ],
}
