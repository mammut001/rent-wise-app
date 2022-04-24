module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      "babel-plugin-root-import",
      {
        "paths": [
          {
            "rootPathPrefix": "@api",
            "rootPathSuffix": "src/api"
          },
          {
            "rootPathPrefix": "@firebase",
            "rootPathSuffix": "src/firebase"
          },
          {
            "rootPathPrefix": "@screens",
            "rootPathSuffix": "src/screens"
          },

          {
            "rootPathPrefix": "@assets",
            "rootPathSuffix": "src/assets"
          },
          {
            "rootPathPrefix": "@common",
            "rootPathSuffix": "src/common"
          },
          {
            "rootPathPrefix": "@config",
            "rootPathSuffix": "src/config"
          },
          {
            "rootPathPrefix": "@style",
            "rootPathSuffix": "src/style"
          },
          {
            "rootPathPrefix": "@utils",
            "rootPathSuffix": "src/utils"
          },
          {
            "rootPathPrefix": "@components",
            "rootPathSuffix": "src/components"
          },
          {
            "rootPathPrefix": "@global",
            "rootPathSuffix": "src/global"
          },
          {
            "rootPathPrefix": "@router",
            "rootPathSuffix": "src/router"
          },
          {
            "rootPathPrefix": "@store",
            "rootPathSuffix": "src/store"
          }

        ]
      }
    ],
    ["@babel/plugin-proposal-decorators", { "legacy": true }]
  ]
};
