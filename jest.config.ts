// jest.config.ts

export default {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        "^.+\\.tsx?$": "ts-jest" ,
    // process `*.tsx` files with `ts-jest`
    },
    moduleNameMapper: {
        // '^.+\\.svg$': 'jest-transformer-svg',
        // '^.+\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/tests/mocks/fileMock.js',
        // '^.+\\/assets/react.svg': 'jest-transformer-svg',
        '\\.css': 'identity-obj-proxy',
    },
}